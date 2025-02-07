import { useEffect, useRef } from "react";
import { faCopy, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Alert, Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { Card, DownloadData, SortableTable } from "@/components";
import { AlleleCrispr } from "@/models/allele/crispr";
import styles from "./styles.module.scss";

const CopyButton = ({ sequence }) => {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    if (clicked) return;
    const storage = document.createElement("textarea");
    storage.value = sequence;
    document.body.appendChild(storage);

    // Copy the text in the fake `textarea` and remove the `textarea`
    storage.select();
    storage.setSelectionRange(0, 999999);
    document.execCommand("copy");
    document.body.removeChild(storage);
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  }

  return (
    <button onClick={handleClick} className="btn impc-secondary-button small">
      <FontAwesomeIcon icon={faCopy} /> {clicked ? "Copied!" : "Copy"}
    </button>
  );
};

const Crispr = ({
  mgiGeneAccessionId,
  alleleName,
}: {
  mgiGeneAccessionId: string;
  alleleName: string;
}) => {
  const genomeBrowserRef = useRef(null);
  const [isBrowserSetup, setIsBrowserSetup] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["genes", mgiGeneAccessionId, "alleles", "crispr", alleleName],
    queryFn: () =>
      fetchAPI(
        `/api/v1/alleles/crispr/get_by_mgi_and_allele_superscript/${mgiGeneAccessionId}/${alleleName}`,
      ),
    select: (data) => (data ?? [])[0] || undefined,
  });

  useEffect(() => {
    async function setupIGVBrowser() {
      const geneSymbol = data.alleleSymbol.split("<")[0];
      const igv = (await import("igv/dist/igv.esm")).default;
      const igvContainer = document.querySelector("#igv-container");
      const igvOptions = {
        locus: geneSymbol,
        flanking: 5000,
        loadDefaultGenomes: false,
        reference: {
          id: "mm39",
          name: "Mouse (GRCm39/mm39)",
          fastaURL: "https://s3.amazonaws.com/igv.org.genomes/mm39/mm39.fa",
          indexURL: "https://s3.amazonaws.com/igv.org.genomes/mm39/mm39.fa.fai",
          chromSizesURL:
            "https://hgdownload.soe.ucsc.edu/goldenPath/mm39/bigZips/mm39.chrom.sizes",
        },
        tracks: [
          {
            name: "IMPC CRISPR guides",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/impc_crispr_allele_guides_202408.bb",
          },
          {
            name: "Molecular deletions identified in IMPC CRISPR alleles",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/impc_crispr_allele_fasta_202409.bb",
          },
          {
            name: "Refseq Curated",
            format: "refgene",
            url: "https://hgdownload.soe.ucsc.edu/goldenPath/mm39/database/ncbiRefSeqCurated.txt.gz",
            indexed: false,
            height: 150,
          },
        ],
      };
      const browser = await igv.createBrowser(igvContainer, igvOptions);
      browser.search(data.mgiGeneAccessionId);
      genomeBrowserRef.current = browser;
      setIsBrowserSetup(true);
    }

    if (data && !isBrowserSetup && !!window) {
      setupIGVBrowser();
    }
  }, [data, isBrowserSetup]);

  const resetView = () => {
    if (genomeBrowserRef.current) {
      genomeBrowserRef.current.search(data.mgiGeneAccessionId);
    }
  };

  const toggleGencodeTrack = (selection: boolean) => {
    if (genomeBrowserRef.current) {
      if (selection) {
        genomeBrowserRef.current.loadTrack({
          name: "Gencode",
          url: "https://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_mouse/release_M36/gencode.vM36.basic.annotation.gff3.gz",
          indexed: false,
          height: 150,
          format: "gff3",
          searchable: true,
          searchableFields: [
            "name",
            "transcript_id",
            "gene_id",
            "gene_name",
            "id",
            "mgi_id",
          ],
        });
      } else {
        genomeBrowserRef.current.removeTrackByName("Gencode");
      }
    }
  };

  if (isLoading) {
    return (
      <Card id="cripsr">
        <h2>Crispr</h2>
        <p className="grey">Loading...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card id="cripsr">
        <h2>Crispr</h2>
        <Alert variant="primary">
          No Crispr products found for this allele.
        </Alert>
      </Card>
    );
  }

  const valuePair = (key, value) => (
    <div>
      <span className="grey">{key}: </span>
      <strong>{value}</strong>
    </div>
  );

  const tableHeaders = [
    { field: "guideSequence", label: "Guide sequence", width: 2 },
    { field: "pam", label: "PAM", width: 2 },
    { field: "chr", label: "CHR", width: 2 },
    { field: "start", label: "Start", width: 2 },
    { field: "stop", label: "Stop", width: 2 },
    { field: "strand", label: "Strand", width: 2 },
    { field: "genomeBuild", label: "Genome build", width: 2 },
    { field: "grnaConcentration", label: "GRNA concentration", width: 2 },
    { field: "truncatedGuide", label: "Truncated guide", width: 2 },
    { field: "reversed", label: "Reversed", width: 2 },
    { field: "sangerService", label: "Sanger service", width: 2 },
    { field: "guideFormat", label: "Guide format", width: 2 },
    { field: "guideSource", label: "Guide source", width: 2 },
  ];

  return !data ? (
    <Card id="crispr">
      <h2>Crispr</h2>
      <Alert variant="primary" style={{ marginTop: "1em" }}>
        No Crispr products found for this allele.
      </Alert>
    </Card>
  ) : (
    <>
      {!!data.fasta && (
        <Card id="crispr">
          <h2>Sequence</h2>
          {data.fasta.map(
            ({ sequence, sequenceType, sequenceCategory }, index) => (
              <div
                className={`bg-grey-light ${index > 0 && "mt-3"}`}
                style={{ padding: "1rem", position: "relative" }}
                key={index}
              >
                {sequence}
                <p className="grey mt-2 mb-0 small">
                  Type: {sequenceType}
                  <span className="ms-3 me-3 ">|</span>Category:{" "}
                  {sequenceCategory}
                </p>
                <div style={{ position: "absolute", bottom: 16, right: 16 }}>
                  <CopyButton sequence={sequence} />
                </div>
              </div>
            ),
          )}
        </Card>
      )}
      <Card>
        <h2>Crispr details</h2>
        <p>
          <a
            href={`https://www.informatics.jax.org/allele/${data.mgiAlleleId}`}
            target="_blank"
            className="link primary"
          >
            {data.mgiGeneAccessionId}&nbsp;
            <span className="grey">
              <FontAwesomeIcon size="xs" icon={faExternalLink} />
            </span>
          </a>
        </p>

        <h3 className="mb-0 mt-1">Nucleases</h3>
        {data.nucleases?.map(({ nucleaseType, nucleaseClass }, index) => (
          <div className="mt-3" key={index}>
            {valuePair("Type", nucleaseType)}
            {valuePair("Class", nucleaseClass)}
          </div>
        ))}

        <h3 className="mb-0 mt-4">Genotype primers</h3>
        {data.genotypePrimers?.map(({ name, sequence }, index) => (
          <div className="mt-3" key={index}>
            {valuePair("Name", name)}
            {valuePair("Sequence", sequence)}
          </div>
        ))}

        <h3 className="mb-0 mt-4">Guides</h3>
        <SortableTable doSort={() => {}} headers={tableHeaders}>
          {data.guides.map((guide) => {
            return (
              <tr key={guide.guideSequence}>
                {tableHeaders.map(({ field }) => (
                  <td>{guide[field]}</td>
                ))}
              </tr>
            );
          })}
        </SortableTable>
        <DownloadData<AlleleCrispr>
          data={() => [data]}
          fileName={`${alleleName}-crispr-data`}
          fields={[
            {
              key: "nucleases",
              label: "Nuclease type",
              getValueFn: (item) =>
                item.nucleases?.map((n) => n.nucleaseType).join(", ") || "N/A",
            },
            {
              key: "nucleases",
              label: "Nuclease Class",
              getValueFn: (item) =>
                item.nucleases?.map((n) => n.nucleaseClass).join(", ") || "N/A",
            },
            {
              key: "genotypePrimers",
              label: "Genotype primer name",
              getValueFn: (item) =>
                item.genotypePrimers?.map((n) => n.name).join(", ") || "N/A",
            },
            {
              key: "genotypePrimers",
              label: "Genotype primer sequence",
              getValueFn: (item) =>
                item.genotypePrimers?.map((n) => n.sequence).join(", ") ||
                "N/A",
            },
            {
              key: "guides",
              label: "Guides",
              getValueFn: (item) =>
                item.guides
                  .map(
                    (guide) =>
                      `Sequence: ${guide.guideSequence}, PAM: ${guide.pam}, CHR: ${guide.chr}, Genome build: ${guide.genomeBuild}`,
                  )
                  .join(" | "),
            },
          ]}
        />
      </Card>
      <Card>
        <h2 className="mb-4 mt-0">Genome browser</h2>
        <div className={styles.controlsContainer}>
          <div>
            <Form.Label className="d-inline-block me-3 mb-0">
              Gene annotation tracks:
            </Form.Label>
            <Form.Check
              className="mb-0"
              inline
              disabled
              checked
              label="Refseq"
              type="checkbox"
            />
            <Form.Check
              className="mb-0"
              inline
              label="Gencode"
              name="group1"
              onChange={(e) => toggleGencodeTrack(e.target.checked)}
            />
          </div>
          <button
            className="btn impc-secondary-button small"
            onClick={() => resetView()}
          >
            Reset view
          </button>
        </div>
        <div id="igv-container" />
      </Card>
    </>
  );
};
export default Crispr;
