"use client";

import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Card } from "@/components";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";

type GenomeBrowserProps = {
  geneSymbol: string;
  mgiGeneAccessionId: string;
  hasCRISPRData: boolean;
  hasEsCellData: boolean;
  hasTargetingVectorData: boolean;
};

type BrowserProps = {
  search: (value: string) => void;
  loadTrack: (config: any) => void;
  removeTrackByName: (trackName: string) => void;
};

type SelectedTracks = {
  crisprGuides: boolean;
  crisprDeletions: boolean;
  esCellAlleles: boolean;
  esCellProducts: boolean;
  targetingVectors: boolean;
};

const PRODUCTS_TRACKS = {
  crisprGuides: {
    name: "IMPC CRISPR guides",
    url: "https://ftp.ebi.ac.uk/pub/databases/impc/other/genome-browser/guide_bb_file.bb",
    order: 10,
  },
  crisprDeletions: {
    name: "Molecular deletions identified in IMPC CRISPR alleles",
    url: "https://ftp.ebi.ac.uk/pub/databases/impc/other/genome-browser/aligned_fa_bigBed.bb",
    order: 11,
  },
  esCellAlleles: {
    name: "ES Cell based Mouse Alleles",
    url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/ikmc_ucsc_impc_mouse_alleles.bb",
  },
  esCellProducts: {
    name: "ES Cell Products",
    url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/ikmc_ucsc_impc_es_cell_alleles.bb",
  },
  targetingVectors: {
    name: "Targeting Vector Products",
    url: "https://impc-datasets.s3.eu-west-2.amazonaws.com/genome_data/ikmc_ucsc_impc_targeting_vectors.bb",
  },
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
  hasCRISPRData,
  hasEsCellData,
  hasTargetingVectorData,
}: GenomeBrowserProps) => {
  let genomeBrowserRef = useRef<BrowserProps | null>(null);
  const [isBrowserSetup, setIsBrowserSetup] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<SelectedTracks>({
    crisprGuides: false,
    crisprDeletions: false,
    esCellAlleles: false,
    esCellProducts: false,
    targetingVectors: false,
  });

  useLayoutEffect(() => {
    let shouldCreateBrowser = true;
    async function setupIGVBrowser() {
      const igv = (await import("igv/dist/igv.esm")).default;
      const igvContainer = document.querySelector("#igv-container");
      const selectedTracks: Record<string, boolean> = {};
      let tracks: Array<any> = [
        {
          name: "Refseq Curated",
          format: "refgene",
          url: "https://hgdownload.soe.ucsc.edu/goldenPath/mm39/database/ncbiRefSeqCurated.txt.gz",
          indexed: false,
          height: 220,
          order: 0,
          removable: false,
        },
      ];
      if (hasCRISPRData) {
        tracks.push(
          PRODUCTS_TRACKS.crisprGuides,
          PRODUCTS_TRACKS.crisprDeletions,
        );
        selectedTracks.crisprGuides = true;
        selectedTracks.crisprDeletions = true;
      }
      if (hasEsCellData) {
        tracks.push(
          PRODUCTS_TRACKS.esCellAlleles,
          PRODUCTS_TRACKS.esCellProducts,
        );
        selectedTracks.esCellAlleles = true;
        selectedTracks.esCellProducts = true;
      }
      if (hasTargetingVectorData) {
        tracks.push(PRODUCTS_TRACKS.targetingVectors);
        selectedTracks.targetingVectors = true;
      }
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
        search: {
          url: "https://www.gentar.org/orthology-api/api/ortholog/get-coordinates/search?geneQuery=$FEATURE$",
          resultsField: "results",
        },
        tracks,
      };
      if (shouldCreateBrowser) {
        const browser = await igv.createBrowser(igvContainer, igvOptions);
        browser.search(mgiGeneAccessionId);
        genomeBrowserRef.current = browser;
        setIsBrowserSetup(true);
        setSelectedTracks((prevState) => ({
          ...prevState,
          ...selectedTracks,
        }));
      }
    }
    if (!!mgiGeneAccessionId && !!geneSymbol && !isBrowserSetup && !!window) {
      setupIGVBrowser();
    }
    return () => {
      shouldCreateBrowser = false;
    };
    // IMPORTANT: no dependencies to ensure effect only runs once (IGV browser creation)
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

  const toggleProductTrack = (name: keyof SelectedTracks, value: boolean) => {
    if (genomeBrowserRef.current) {
      if (value) {
        genomeBrowserRef.current.loadTrack(PRODUCTS_TRACKS[name]);
      } else {
        genomeBrowserRef.current.removeTrackByName(PRODUCTS_TRACKS[name].name);
      }
      setSelectedTracks((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <Card>
      <Container style={{ padding: 0 }}>
        <Row>
          <Col>
            <h2 className="mb-3 mt-0">Genome browser</h2>
          </Col>
          <Col className={styles.resetBtnContainer}>
            <button
              className="btn impc-secondary-button small"
              onClick={() => resetView()}
            >
              Reset view
            </button>
          </Col>
        </Row>
        <Row style={{ position: "relative" }}>
          <Col>
            <div className={styles.controlsContainer}>
              <div>
                <Form.Label className="d-inline-block fst-italic me-3 mb-0">
                  Annotation tracks:
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
                  onChange={(e) =>
                    toggleOptionalTrack("GENCODE", e.target.checked)
                  }
                />
              </div>
            </div>
            <hr />
            <div className={styles.controlsContainer}>
              <div>
                <Form.Label className="d-inline-block fst-italic me-3 mb-0">
                  Product tracks:
                </Form.Label>
                <Form.Check
                  className="mb-0"
                  inline
                  label="CRISPR Guides"
                  checked={selectedTracks.crisprGuides}
                  onChange={(e) =>
                    toggleProductTrack("crisprGuides", e.target.checked)
                  }
                />
                <Form.Check
                  className="mb-0"
                  inline
                  label="CRISPR Deletions"
                  checked={selectedTracks.crisprDeletions}
                  onChange={(e) =>
                    toggleProductTrack("crisprDeletions", e.target.checked)
                  }
                />
                <Form.Check
                  className="mb-0"
                  inline
                  label="ES Cells Products"
                  checked={selectedTracks.esCellProducts}
                  onChange={(e) =>
                    toggleProductTrack("esCellProducts", e.target.checked)
                  }
                />
                <Form.Check
                  className="mb-0"
                  inline
                  label="ES Cells Alleles"
                  checked={selectedTracks.esCellAlleles}
                  onChange={(e) =>
                    toggleProductTrack("esCellAlleles", e.target.checked)
                  }
                />
                <Form.Check
                  className="mb-0"
                  inline
                  label="Targeting vectors"
                  checked={selectedTracks.targetingVectors}
                  onChange={(e) =>
                    toggleProductTrack("targetingVectors", e.target.checked)
                  }
                />
              </div>
            </div>
            <hr />
            <div className={styles.controlsContainer}>
              <div>
                <Form.Label className="d-inline-block me-3 mb-0 fst-italic">
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
            </div>
          </Col>
          <div
            className={classNames(styles.overlay, {
              [styles.active]: !isBrowserSetup,
            })}
          >
            <Spinner variant="primary" />
          </div>
        </Row>
      </Container>

      <div id="igv-container" />
    </Card>
  );
};

export default GenomeBrowser;
