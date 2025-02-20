"use client";

import { Form } from "react-bootstrap";
import { Card } from "@/components";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

type GenomeBrowserProps = {
  geneSymbol: string;
  mgiGeneAccessionId: string;
};

type BrowserProps = {
  search: (value: string) => void;
  loadTrack: (config: any) => void;
  removeTrackByName: (trackName: string) => void;
};

const GenomeBrowser = ({
  geneSymbol,
  mgiGeneAccessionId,
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
            name: "IMPC CRISPR guides",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/guide_bb_file_14_02_2025.bb",
          },
          {
            name: "Molecular deletions identified in IMPC CRISPR alleles",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/aligned_fa_bigBed_14_02_2025.bb",
          },
          {
            name: "IKMC alleles",
            url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/ikmc_ucsc_alleles.bb",
            height: 130,
          },
          {
            name: "Refseq Curated",
            format: "refgene",
            url: "https://hgdownload.soe.ucsc.edu/goldenPath/mm39/database/ncbiRefSeqCurated.txt.gz",
            indexed: false,
            height: 220,
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
  const toggleGencodeTrack = (selection: boolean) => {
    if (genomeBrowserRef.current) {
      if (selection) {
        genomeBrowserRef.current.loadTrack({
          name: "Gencode",
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
        });
      } else {
        genomeBrowserRef.current.removeTrackByName("Gencode");
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
  );
};

export default GenomeBrowser;
