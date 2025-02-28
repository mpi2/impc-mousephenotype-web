"use client";

import { Form } from "react-bootstrap";
import { Card } from "@/components";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

type GenomeBrowserProps = {
  geneSymbol: string;
  mgiGeneAccessionId: string;
  section: "CRISPR" | "ES Cell" | "Targeting Vector";
};

type BrowserProps = {
  search: (value: string) => void;
  loadTrack: (config: any) => void;
  removeTrackByName: (trackName: string) => void;
};

const optionalTracks = {
  GENCODE: {
    name: "GENCODE",
    url: "https://ftp.ebi.ac.uk/pub/databases/gencode/Gencode_mouse/release_M36/gencode.vM36.basic.annotation.gff3.gz",
    indexed: false,
    height: 200,
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
    nameField: "gene_name",
    order: 0,
  },
  "UniProt SwissProt/TrEMBL Protein Annotations": {
    name: "UniProt SwissProt/TrEMBL Protein Annotations",
    url: "https://hgdownload.soe.ucsc.edu/gbdb/mm39/uniprot/unipAliSwissprot.bb",
    indexed: false,
    nameField: "GeneName",
    height: 100,
  },
  "IKMC alleles": {
    name: "IKMC alleles",
    url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/ikmc_ucsc_alleles.bb",
    height: 130,
    order: 20,
  },
};

const GenomeBrowser = ({
  geneSymbol,
  mgiGeneAccessionId,
  section,
}: GenomeBrowserProps) => {
  let genomeBrowserRef = useRef<BrowserProps>(null);
  const [isBrowserSetup, setIsBrowserSetup] = useState(false);
  useLayoutEffect(() => {
    let shouldCreateBrowser = true;
    async function setupIGVBrowser() {
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
            name: "Refseq Curated",
            format: "refgene",
            url: "https://hgdownload.soe.ucsc.edu/goldenPath/mm39/database/ncbiRefSeqCurated.txt.gz",
            indexed: false,
            height: 220,
            order: 0,
            removable: false,
          },
          {
            name: "Targeting Vector Products",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/ikmc_ucsc_impc_targeting_vectors.bb",
          },
          {
            name: "ES Cell based Mouse Alleles",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/ikmc_ucsc_impc_mouse_alleles.bb",
          },
          {
            name: "ES Cell Products",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/ikmc_ucsc_impc_es_cell_alleles.bb",
          },
          {
            name: "IMPC CRISPR guides",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/guide_bb_21_02_2025.bb",
            order: 10,
          },
          {
            name: "Molecular deletions identified in IMPC CRISPR alleles",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/aligned_fa_bb_21_02_2025.bb",
            order: 11,
          },
        ],
      };
      if (shouldCreateBrowser) {
        const browser = await igv.createBrowser(igvContainer, igvOptions);
        browser.search(mgiGeneAccessionId);
        genomeBrowserRef.current = browser;
        setIsBrowserSetup(true);
      }
    }
    if (!!mgiGeneAccessionId && !!geneSymbol && !isBrowserSetup && !!window) {
      setupIGVBrowser();
    }
    return () => {
      shouldCreateBrowser = false;
    };
  }, []);

  const resetView = () => {
    if (genomeBrowserRef.current) {
      genomeBrowserRef.current.search(mgiGeneAccessionId);
    }
  };
  const toggleOptionalTrack = (
    name: keyof typeof optionalTracks,
    selection: boolean,
  ) => {
    if (genomeBrowserRef.current) {
      if (selection) {
        genomeBrowserRef.current.loadTrack(optionalTracks[name]);
      } else {
        genomeBrowserRef.current.removeTrackByName(name);
      }
    }
  };

  return (
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
            label="GENCODE"
            name="group1"
            onChange={(e) => toggleOptionalTrack("GENCODE", e.target.checked)}
          />
        </div>
        <div>
          <Form.Label className="d-inline-block me-3 mb-0">
            Additional tracks:
          </Form.Label>
          <Form.Check
            className="mb-0"
            inline
            label="IKMC alleles"
            onChange={(e) =>
              toggleOptionalTrack("IKMC alleles", e.target.checked)
            }
          />
          <Form.Check
            className="mb-0"
            inline
            label="UniProt SwissProt/TrEMBL Protein Annotations"
            name="group1"
            onChange={(e) =>
              toggleOptionalTrack(
                "UniProt SwissProt/TrEMBL Protein Annotations",
                e.target.checked,
              )
            }
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
  );
};

export default GenomeBrowser;
