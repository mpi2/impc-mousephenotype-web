import {
  waitFor,
  render,
  screen,
  getAllByRole,
  act,
} from "@testing-library/react";
import GeneSignificantPhenotypes from "@/components/Gene/Phenotypes/SignificantPhenotypes";
import { GeneContext } from "@/contexts";
import { GeneSummary } from "@/models/gene";
import userEvent from "@testing-library/user-event";
import { summarySystemSelectionChannel } from "@/eventChannels";

const gene = { mgiGeneAccessionId: "MGI:104785", geneSymbol: "Myo6" };
const data = [
  {
    datasetId: "fe444e3d4090e7da1efe9e4174eb7b6e",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_OFD_001",
    procedureName: "Open Field",
    parameterStableId: "IMPC_OFD_011_001",
    parameterName: "Periphery resting time",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 2.77924377993103e-186,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0001399",
      name: "hyperactivity",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0003491",
        name: "abnormal voluntary movement",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
    ],
    pValue_male: 2.97584635421897e-127,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "hyperactivity",
    id: "MP:0001399",
    phenotypeId: "MP:0001399",
    numberOfDatasets: 17,
    pValue_female: 3.67929889442108e-105,
  },
  {
    datasetId: "0e86507150cd8ba6fefdd2fa43f75346",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_HEM_002",
    procedureName: "Hematology",
    parameterStableId: "IMPC_HEM_005_001",
    parameterName: "Mean cell volume",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0.00000107279390037539,
    lifeStageName: "Early adult",
    effectSize: 2.77464573434376,
    phenotype: {
      id: "MP:0002590",
      name: "increased mean corpuscular volume",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005397",
        name: "hematopoietic system phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0000226",
        name: "abnormal mean corpuscular volume",
      },
      {
        id: "MP:0013658",
        name: "abnormal myeloid cell morphology",
      },
      {
        id: "MP:0013657",
        name: "abnormal blood cell morphology",
      },
      {
        id: "MP:0002396",
        name: "abnormal hematopoietic system morphology/development",
      },
      {
        id: "MP:0002447",
        name: "abnormal erythrocyte morphology",
      },
      {
        id: "MP:0013659",
        name: "abnormal erythroid lineage cell morphology",
      },
      {
        id: "MP:0013656",
        name: "abnormal hematopoietic cell morphology",
      },
    ],
    pValue_male: 0.00000107279390037539,
    topLevelPhenotypeName: "hematopoietic system phenotype",
    phenotypeName: "increased mean corpuscular volume",
    id: "MP:0002590",
    phenotypeId: "MP:0002590",
    numberOfDatasets: 1,
  },
  {
    datasetId: "039e1456e574b4aa9982089d4d1bac3e",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_DXA_001",
    procedureName: "Body Composition (DEXA lean/fat)",
    parameterStableId: "IMPC_DXA_009_001",
    parameterName: "Fat/Body weight",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0.0000725800553651755,
    lifeStageName: "Early adult",
    effectSize: -2.17170172129593,
    phenotype: {
      id: "MP:0010025",
      name: "decreased total body fat amount",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005375",
        name: "adipose tissue phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0000003",
        name: "abnormal adipose tissue morphology",
      },
      {
        id: "MP:0005452",
        name: "abnormal adipose tissue amount",
      },
    ],
    pValue_male: 0.0000725800553651755,
    topLevelPhenotypeName: "adipose tissue phenotype",
    phenotypeName: "decreased total body fat amount",
    id: "MP:0010025",
    phenotypeId: "MP:0010025",
    numberOfDatasets: 1,
  },
  {
    datasetId: "95020adfc4074c535a6d4e7140430b33",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_PAT_002",
    procedureName: "Gross Pathology and Tissue Collection",
    parameterStableId: "IMPC_PAT_063_001",
    parameterName: "Sternum",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0,
    lifeStageName: "Early adult",
    effectSize: 1,
    phenotype: {
      id: "MP:0000157",
      name: "abnormal sternum morphology",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005390",
        name: "skeleton phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0004508",
        name: "abnormal pectoral girdle bone morphology",
      },
      {
        id: "MP:0004624",
        name: "abnormal thoracic cage morphology",
      },
      {
        id: "MP:0005508",
        name: "abnormal skeleton morphology",
      },
      {
        id: "MP:0009250",
        name: "abnormal appendicular skeleton morphology",
      },
      {
        id: "MP:0002114",
        name: "abnormal axial skeleton morphology",
      },
    ],
    pValue_male: 0,
    topLevelPhenotypeName: "skeleton phenotype",
    phenotypeName: "abnormal sternum morphology",
    id: "MP:0000157",
    phenotypeId: "MP:0000157",
    numberOfDatasets: 1,
  },
  {
    datasetId: "8d7d2ee08269d11face6e90c023a5e66",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_PAT_002",
    procedureName: "Gross Pathology and Tissue Collection",
    parameterStableId: "IMPC_PAT_023_002",
    parameterName: "Urinary bladder",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0,
    lifeStageName: "Early adult",
    effectSize: 1,
    phenotype: {
      id: "MP:0011874",
      name: "enlarged urinary bladder",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005367",
        name: "renal/urinary system phenotype",
      },
      {
        id: "MP:0005378",
        name: "growth/size/body region phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0031094",
        name: "organomegaly",
      },
      {
        id: "MP:0000538",
        name: "abnormal urinary bladder morphology",
      },
      {
        id: "MP:0000516",
        name: "abnormal renal/urinary system morphology",
      },
    ],
    pValue_male: 0,
    topLevelPhenotypeName: "renal/urinary system phenotype",
    phenotypeName: "enlarged urinary bladder",
    id: "MP:0011874",
    phenotypeId: "MP:0011874",
    numberOfDatasets: 1,
  },
  {
    datasetId: "f4547cc93d174c6a520d9510599fe88b",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_CBC_003",
    procedureName: "Clinical Chemistry",
    parameterStableId: "IMPC_CBC_010_001",
    parameterName: "Phosphorus",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "not_considered",
    projectName: "DTCC",
    pValue: 0.0000802493050032771,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0001566",
      name: "increased circulating phosphate level",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005376",
        name: "homeostasis/metabolism phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0005636",
        name: "abnormal mineral homeostasis",
      },
      {
        id: "MP:0020885",
        name: "abnormal phosphate level",
      },
      {
        id: "MP:0000192",
        name: "abnormal mineral level",
      },
      {
        id: "MP:0009642",
        name: "abnormal blood homeostasis",
      },
      {
        id: "MP:0001565",
        name: "abnormal circulating phosphate level",
      },
      {
        id: "MP:0001764",
        name: "abnormal homeostasis",
      },
      {
        id: "MP:0001765",
        name: "abnormal ion homeostasis",
      },
      {
        id: "MP:0006357",
        name: "abnormal circulating mineral level",
      },
    ],
    pValue_not_considered: 0.0000802493050032771,
    topLevelPhenotypeName: "homeostasis/metabolism phenotype",
    phenotypeName: "increased circulating phosphate level",
    id: "MP:0001566",
    phenotypeId: "MP:0001566",
    numberOfDatasets: 1,
  },
  {
    datasetId: "a431f552f127be6eee192232c04979a7",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_CBC_003",
    procedureName: "Clinical Chemistry",
    parameterStableId: "IMPC_CBC_014_001",
    parameterName: "Alkaline phosphatase",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 7.55122482224014e-12,
    lifeStageName: "Early adult",
    effectSize: 4.39681921019864,
    phenotype: {
      id: "MP:0002968",
      name: "increased circulating alkaline phosphatase level",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005376",
        name: "homeostasis/metabolism phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0005416",
        name: "abnormal circulating protein level",
      },
      {
        id: "MP:0001570",
        name: "abnormal circulating enzyme level",
      },
      {
        id: "MP:0009642",
        name: "abnormal blood homeostasis",
      },
      {
        id: "MP:0008469",
        name: "abnormal protein level",
      },
      {
        id: "MP:0000202",
        name: "abnormal circulating alkaline phosphatase level",
      },
      {
        id: "MP:0001764",
        name: "abnormal homeostasis",
      },
      {
        id: "MP:0005319",
        name: "abnormal enzyme/coenzyme level",
      },
    ],
    pValue_male: 7.55122482224014e-12,
    topLevelPhenotypeName: "homeostasis/metabolism phenotype",
    phenotypeName: "increased circulating alkaline phosphatase level",
    id: "MP:0002968",
    phenotypeId: "MP:0002968",
    numberOfDatasets: 1,
  },
  {
    datasetId: "34ed23e1b6e795825adab5babe6b0f3a",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_PAT_002",
    procedureName: "Gross Pathology and Tissue Collection",
    parameterStableId: "IMPC_PAT_012_002",
    parameterName: "Stomach",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0,
    lifeStageName: "Early adult",
    effectSize: 1,
    phenotype: {
      id: "MP:0000470",
      name: "abnormal stomach morphology",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005381",
        name: "digestive/alimentary phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0000462",
        name: "abnormal digestive system morphology",
      },
    ],
    pValue_male: 0,
    topLevelPhenotypeName: "digestive/alimentary phenotype",
    phenotypeName: "abnormal stomach morphology",
    id: "MP:0000470",
    phenotypeId: "MP:0000470",
    numberOfDatasets: 1,
  },
  {
    datasetId: "df19a201cc8399df85d78398a433ba1e",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_DXA_001",
    procedureName: "Body Composition (DEXA lean/fat)",
    parameterStableId: "IMPC_DXA_004_001",
    parameterName: "Bone Mineral Density (excluding skull)",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0.00000784382207061555,
    lifeStageName: "Early adult",
    effectSize: -3.33122550235188,
    phenotype: {
      id: "MP:0000063",
      name: "decreased bone mineral density",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005390",
        name: "skeleton phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0010119",
        name: "abnormal bone mineral density",
      },
      {
        id: "MP:0003795",
        name: "abnormal bone structure",
      },
      {
        id: "MP:0005508",
        name: "abnormal skeleton morphology",
      },
    ],
    pValue_male: 0.00000784382207061555,
    topLevelPhenotypeName: "skeleton phenotype",
    phenotypeName: "decreased bone mineral density",
    id: "MP:0000063",
    phenotypeId: "MP:0000063",
    numberOfDatasets: 1,
    pValue_female: 0.0000128245362469389,
  },
  {
    datasetId: "9875b568ba425f24dbefb073118423c7",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_ACS_003",
    procedureName: "Acoustic Startle and Pre-pulse Inhibition (PPI)",
    parameterStableId: "IMPC_ACS_037_001",
    parameterName: "% Pre-pulse inhibition - Global",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 2.46472009654743e-72,
    lifeStageName: "Early adult",
    effectSize: -4.39286081108105,
    phenotype: {
      id: "MP:0009142",
      name: "decreased prepulse inhibition",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0003631",
        name: "nervous system phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0003633",
        name: "abnormal nervous system physiology",
      },
      {
        id: "MP:0021009",
        name: "abnormal synaptic physiology",
      },
      {
        id: "MP:0002206",
        name: "abnormal CNS synaptic transmission",
      },
      {
        id: "MP:0003635",
        name: "abnormal synaptic transmission",
      },
      {
        id: "MP:0003088",
        name: "abnormal prepulse inhibition",
      },
    ],
    pValue_male: 1.34851482086353e-22,
    topLevelPhenotypeName: "nervous system phenotype",
    phenotypeName: "decreased prepulse inhibition",
    id: "MP:0009142",
    phenotypeId: "MP:0009142",
    numberOfDatasets: 8,
    pValue_female: 3.22113525019501e-29,
  },
  {
    datasetId: "a7b02df274cca7803d460e0ee2433079",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "GMC_001",
    procedureStableId: "GMC_914_001",
    procedureName: "Food efficiency (GMC)",
    parameterStableId: "GMC_914_001_002",
    parameterName: "Body temperature rectal",
    alleleAccessionId: "NOT-RELEASED-d747ce2419",
    alleleName: null,
    alleleSymbol: "Myo6<Tlc>",
    zygosity: "heterozygote",
    phenotypingCentre: "HMGU",
    sex: "female",
    projectName: "EUMODIC",
    pValue: 3.15545564269241e-8,
    lifeStageName: "Early adult",
    effectSize: -3.31272071755649,
    phenotype: {
      id: "MP:0005534",
      name: "decreased body temperature",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005376",
        name: "homeostasis/metabolism phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0001764",
        name: "abnormal homeostasis",
      },
      {
        id: "MP:0005535",
        name: "abnormal body temperature",
      },
    ],
    pValue_male: 0.0000171801579570606,
    topLevelPhenotypeName: "homeostasis/metabolism phenotype",
    phenotypeName: "decreased body temperature",
    id: "MP:0005534",
    phenotypeId: "MP:0005534",
    numberOfDatasets: 1,
  },
  {
    datasetId: "2c6d7cc0dcc55c5a4e9df9b9cc1b5bde",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_ABR_002",
    procedureName: "Auditory Brain Stem Response",
    parameterStableId: "IMPC_ABR_010_001",
    parameterName: "24kHz-evoked ABR Threshold",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "not_considered",
    projectName: "DTCC",
    pValue: 8.91351548467908e-7,
    lifeStageName: "Early adult",
    effectSize: 0.961538461538462,
    phenotype: {
      id: "MP:0004738",
      name: "abnormal auditory brainstem response",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005377",
        name: "hearing/vestibular/ear phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0001963",
        name: "abnormal hearing physiology",
      },
      {
        id: "MP:0003878",
        name: "abnormal ear physiology",
      },
      {
        id: "MP:0006335",
        name: "abnormal hearing electrophysiology",
      },
    ],
    pValue_not_considered: 0.00000189828494607781,
    topLevelPhenotypeName: "hearing/vestibular/ear phenotype",
    phenotypeName: "abnormal auditory brainstem response",
    id: "MP:0004738",
    phenotypeId: "MP:0004738",
    numberOfDatasets: 5,
  },
  {
    datasetId: "f837670aa63084574d243015da1e20d6",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_ACS_003",
    procedureName: "Acoustic Startle and Pre-pulse Inhibition (PPI)",
    parameterStableId: "IMPC_ACS_006_001",
    parameterName: "Response amplitude - S",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0.0000115291288991997,
    lifeStageName: "Early adult",
    effectSize: -1.31299201087997,
    phenotype: {
      id: "MP:0001489",
      name: "decreased startle reflex",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0002067",
        name: "abnormal sensory capabilities/reflexes/nociception",
      },
      {
        id: "MP:0001486",
        name: "abnormal startle reflex",
      },
      {
        id: "MP:0001961",
        name: "abnormal reflex",
      },
      {
        id: "MP:0003492",
        name: "abnormal involuntary movement",
      },
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
    ],
    pValue_male: 0.0000115291288991997,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "decreased startle reflex",
    id: "MP:0001489",
    phenotypeId: "MP:0001489",
    numberOfDatasets: 1,
  },
  {
    datasetId: "408acf4cb9ee547a4b48c6710002eec0",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_CSD_003",
    procedureName: "Combined SHIRPA and Dysmorphology",
    parameterStableId: "IMPC_CSD_080_001",
    parameterName: "Head bobbing",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 3.79892528870762e-19,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0001410",
      name: "head bobbing",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0001408",
        name: "stereotypic behavior",
      },
      {
        id: "MP:0001388",
        name: "abnormal stationary movement",
      },
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0000436",
        name: "abnormal head movements",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
    ],
    pValue_male: 3.79892528870762e-19,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "head bobbing",
    id: "MP:0001410",
    phenotypeId: "MP:0001410",
    numberOfDatasets: 1,
    pValue_female: 1.93955720115667e-16,
  },
  {
    datasetId: "e4b3991e2fe17a265dab4f09042db5e9",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "GMC_001",
    procedureStableId: "GMC_906_001",
    procedureName: "Clinical chemistry (GMC)",
    parameterStableId: "GMC_906_001_018",
    parameterName: "Triglyceride",
    alleleAccessionId: "NOT-RELEASED-d747ce2419",
    alleleName: null,
    alleleSymbol: "Myo6<Tlc>",
    zygosity: "heterozygote",
    phenotypingCentre: "HMGU",
    sex: "male",
    projectName: "EUMODIC",
    pValue: 8.59248816628328e-7,
    lifeStageName: "Early adult",
    effectSize: -1.2256559590511,
    phenotype: {
      id: "MP:0002644",
      name: "decreased circulating triglyceride level",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005376",
        name: "homeostasis/metabolism phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0000187",
        name: "abnormal triglyceride level",
      },
      {
        id: "MP:0001547",
        name: "abnormal lipid level",
      },
      {
        id: "MP:0011969",
        name: "abnormal circulating triglyceride level",
      },
      {
        id: "MP:0009642",
        name: "abnormal blood homeostasis",
      },
      {
        id: "MP:0002118",
        name: "abnormal lipid homeostasis",
      },
      {
        id: "MP:0001764",
        name: "abnormal homeostasis",
      },
      {
        id: "MP:0003949",
        name: "abnormal circulating lipid level",
      },
      {
        id: "MP:0005318",
        name: "decreased triglyceride level",
      },
    ],
    pValue_male: 8.59248816628328e-7,
    topLevelPhenotypeName: "homeostasis/metabolism phenotype",
    phenotypeName: "decreased circulating triglyceride level",
    id: "MP:0002644",
    phenotypeId: "MP:0002644",
    numberOfDatasets: 1,
  },
  {
    datasetId: "a50d01d069562d5e8436310251eead87",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_DXA_001",
    procedureName: "Body Composition (DEXA lean/fat)",
    parameterStableId: "IMPC_DXA_008_001",
    parameterName: "Lean/Body weight",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0.0000310380835363958,
    lifeStageName: "Early adult",
    effectSize: 2.20182616942368,
    phenotype: {
      id: "MP:0003960",
      name: "increased lean body mass",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005378",
        name: "growth/size/body region phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0002089",
        name: "abnormal postnatal growth/weight/body size",
      },
      {
        id: "MP:0003959",
        name: "abnormal lean body mass",
      },
      {
        id: "MP:0005451",
        name: "abnormal body composition",
      },
    ],
    pValue_male: 0.0000310380835363958,
    topLevelPhenotypeName: "growth/size/body region phenotype",
    phenotypeName: "increased lean body mass",
    id: "MP:0003960",
    phenotypeId: "MP:0003960",
    numberOfDatasets: 1,
  },
  {
    datasetId: "1ad049da916022ee326602022c2245ed",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_CSD_003",
    procedureName: "Combined SHIRPA and Dysmorphology",
    parameterStableId: "IMPC_CSD_033_001",
    parameterName: "Gait",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "female",
    projectName: "DTCC",
    pValue: 2.05079727183366e-11,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0001406",
      name: "abnormal gait",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0001392",
        name: "abnormal locomotor behavior",
      },
      {
        id: "MP:0003491",
        name: "abnormal voluntary movement",
      },
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
      {
        id: "MP:0003312",
        name: "abnormal locomotor coordination",
      },
    ],
    pValue_female: 2.05079727183366e-11,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "abnormal gait",
    id: "MP:0001406",
    phenotypeId: "MP:0001406",
    numberOfDatasets: 1,
    pValue_male: 5.10247194136267e-9,
  },
  {
    datasetId: "e5210eb001189538ba2d70e42e4f77bb",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_OFD_001",
    procedureName: "Open Field",
    parameterStableId: "IMPC_OFD_050_001",
    parameterName: "Percentage center movement time",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 4.86081859732476e-12,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0001364",
      name: "decreased anxiety-related response",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0002065",
        name: "abnormal fear/anxiety-related behavior",
      },
      {
        id: "MP:0001362",
        name: "abnormal anxiety-related response",
      },
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0002572",
        name: "abnormal emotion/affect behavior",
      },
    ],
    pValue_female: 3.65621535792731e-7,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "decreased anxiety-related response",
    id: "MP:0001364",
    phenotypeId: "MP:0001364",
    numberOfDatasets: 1,
  },
  {
    datasetId: "19ce18e7c4683c0ea485094db1cc2be3",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_ECG_003",
    procedureName: "Electrocardiogram (ECG)",
    parameterStableId: "IMPC_ECG_002_001",
    parameterName: "HR",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 1.38791535479997e-7,
    lifeStageName: "Early adult",
    effectSize: -1.74831280318678,
    phenotype: {
      id: "MP:0005333",
      name: "decreased heart rate",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005385",
        name: "cardiovascular system phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0001544",
        name: "abnormal cardiovascular system physiology",
      },
      {
        id: "MP:0004085",
        name: "abnormal heartbeat",
      },
      {
        id: "MP:0001629",
        name: "abnormal heart rate",
      },
    ],
    pValue_female: 0.00000786252281798033,
    topLevelPhenotypeName: "cardiovascular system phenotype",
    phenotypeName: "decreased heart rate",
    id: "MP:0005333",
    phenotypeId: "MP:0005333",
    numberOfDatasets: 1,
  },
  {
    datasetId: "d93c766e57c5c2371b4eb826f88faf7a",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_HWT_001",
    procedureName: "Heart Weight",
    parameterStableId: "IMPC_HWT_008_001",
    parameterName: "Heart weight",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "not_considered",
    projectName: "DTCC",
    pValue: 0.0000454496548432104,
    lifeStageName: "Early adult",
    effectSize: 0.2438976717064,
    phenotype: {
      id: "MP:0002833",
      name: "increased heart weight",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005385",
        name: "cardiovascular system phenotype",
      },
      {
        id: "MP:0005378",
        name: "growth/size/body region phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0000274",
        name: "enlarged heart",
      },
      {
        id: "MP:0031094",
        name: "organomegaly",
      },
      {
        id: "MP:0002127",
        name: "abnormal cardiovascular system morphology",
      },
      {
        id: "MP:0005406",
        name: "abnormal heart size",
      },
      {
        id: "MP:0004857",
        name: "abnormal heart weight",
      },
      {
        id: "MP:0000266",
        name: "abnormal heart morphology",
      },
    ],
    pValue_not_considered: 0.0000454496548432104,
    topLevelPhenotypeName: "cardiovascular system phenotype",
    phenotypeName: "increased heart weight",
    id: "MP:0002833",
    phenotypeId: "MP:0002833",
    numberOfDatasets: 1,
  },
  {
    datasetId: "da971fd0b378d6677b68319ce54d6cb6",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_GRS_001",
    procedureName: "Grip Strength",
    parameterStableId: "IMPC_GRS_008_001",
    parameterName: "Forelimb grip strength measurement mean",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "female",
    projectName: "DTCC",
    pValue: 1.97716577340701e-7,
    lifeStageName: "Early adult",
    effectSize: -3.20487989453166,
    phenotype: {
      id: "MP:0010053",
      name: "decreased grip strength",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0001515",
        name: "abnormal grip strength",
      },
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
      {
        id: "MP:0004262",
        name: "abnormal physical strength",
      },
    ],
    pValue_female: 1.97716577340701e-7,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "decreased grip strength",
    id: "MP:0010053",
    phenotypeId: "MP:0010053",
    numberOfDatasets: 1,
  },
  {
    datasetId: "bfdcf50da5783c780880b540708ee4da",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_CSD_003",
    procedureName: "Combined SHIRPA and Dysmorphology",
    parameterStableId: "IMPC_CSD_037_001",
    parameterName: "Unexpected behaviors",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "female",
    projectName: "DTCC",
    pValue: 1.93955720115665e-16,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0004924",
      name: "abnormal behavior",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [],
    pValue_female: 1.93955720115665e-16,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "abnormal behavior",
    id: "MP:0004924",
    phenotypeId: "MP:0004924",
    numberOfDatasets: 1,
    pValue_male: 5.10247194136266e-9,
  },
  {
    datasetId: "f0c1eba55eb1d2c9bb0ab40aef309705",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_ECG_003",
    procedureName: "Electrocardiogram (ECG)",
    parameterStableId: "IMPC_ECG_004_001",
    parameterName: "RR",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 1.01078000014277e-8,
    lifeStageName: "Early adult",
    effectSize: 2.28989806579148,
    phenotype: {
      id: "MP:0010506",
      name: "prolonged RR interval",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005385",
        name: "cardiovascular system phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0004085",
        name: "abnormal heartbeat",
      },
      {
        id: "MP:0005333",
        name: "decreased heart rate",
      },
      {
        id: "MP:0001544",
        name: "abnormal cardiovascular system physiology",
      },
      {
        id: "MP:0001629",
        name: "abnormal heart rate",
      },
      {
        id: "MP:0003137",
        name: "abnormal impulse conducting system conduction",
      },
      {
        id: "MP:0010504",
        name: "abnormal RR interval",
      },
      {
        id: "MP:0010508",
        name: "abnormal heart electrocardiography waveform feature",
      },
    ],
    pValue_male: 1.01078000014277e-8,
    topLevelPhenotypeName: "cardiovascular system phenotype",
    phenotypeName: "prolonged RR interval",
    id: "MP:0010506",
    phenotypeId: "MP:0010506",
    numberOfDatasets: 1,
    pValue_female: 6.77945606983628e-7,
  },
  {
    datasetId: "6ca72770ca06298d04ab9369e3a9de6c",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "GMC_001",
    procedureStableId: "GMC_923_001",
    procedureName: "Shirpa (GMC)",
    parameterStableId: "GMC_923_001_004",
    parameterName: "Tremor",
    alleleAccessionId: "NOT-RELEASED-d747ce2419",
    alleleName: null,
    alleleSymbol: "Myo6<Tlc>",
    zygosity: "heterozygote",
    phenotypingCentre: "HMGU",
    sex: "male",
    projectName: "EUMODIC",
    pValue: 1.24354397106811e-16,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0000745",
      name: "tremors",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0003492",
        name: "abnormal involuntary movement",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
    ],
    pValue_male: 1.24354397106811e-16,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "tremors",
    id: "MP:0000745",
    phenotypeId: "MP:0000745",
    numberOfDatasets: 1,
  },
  {
    datasetId: "5e7bcb3efa98f7fcaa282f9a3e4c4a59",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_CSD_003",
    procedureName: "Combined SHIRPA and Dysmorphology",
    parameterStableId: "IMPC_CSD_036_001",
    parameterName: "Startle response",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 2.85679181710793e-16,
    lifeStageName: "Early adult",
    effectSize: null,
    phenotype: {
      id: "MP:0001486",
      name: "abnormal startle reflex",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0002067",
        name: "abnormal sensory capabilities/reflexes/nociception",
      },
      {
        id: "MP:0001961",
        name: "abnormal reflex",
      },
      {
        id: "MP:0003492",
        name: "abnormal involuntary movement",
      },
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
    ],
    pValue_female: 2.05079727183101e-11,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "abnormal startle reflex",
    id: "MP:0001486",
    phenotypeId: "MP:0001486",
    numberOfDatasets: 1,
  },
  {
    datasetId: "743468197032db94d5d70b1e55536458",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_CBC_003",
    procedureName: "Clinical Chemistry",
    parameterStableId: "IMPC_CBC_002_001",
    parameterName: "Potassium",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "female",
    projectName: "DTCC",
    pValue: 0.000091074078059118,
    lifeStageName: "Early adult",
    effectSize: -1.84255614042052,
    phenotype: {
      id: "MP:0005628",
      name: "decreased circulating potassium level",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005376",
        name: "homeostasis/metabolism phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0005636",
        name: "abnormal mineral homeostasis",
      },
      {
        id: "MP:0000192",
        name: "abnormal mineral level",
      },
      {
        id: "MP:0009642",
        name: "abnormal blood homeostasis",
      },
      {
        id: "MP:0020887",
        name: "abnormal potassium level",
      },
      {
        id: "MP:0001764",
        name: "abnormal homeostasis",
      },
      {
        id: "MP:0011978",
        name: "abnormal potassium ion homeostasis",
      },
      {
        id: "MP:0001765",
        name: "abnormal ion homeostasis",
      },
      {
        id: "MP:0002668",
        name: "abnormal circulating potassium level",
      },
      {
        id: "MP:0006357",
        name: "abnormal circulating mineral level",
      },
    ],
    pValue_female: 0.000091074078059118,
    topLevelPhenotypeName: "homeostasis/metabolism phenotype",
    phenotypeName: "decreased circulating potassium level",
    id: "MP:0005628",
    phenotypeId: "MP:0005628",
    numberOfDatasets: 1,
  },
  {
    datasetId: "31b12b9893d17d328647d5c19054dd2b",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "GMC_001",
    procedureStableId: "GMC_906_001",
    procedureName: "Clinical chemistry (GMC)",
    parameterStableId: "GMC_906_001_001",
    parameterName: "Glucose",
    alleleAccessionId: "NOT-RELEASED-d747ce2419",
    alleleName: null,
    alleleSymbol: "Myo6<Tlc>",
    zygosity: "heterozygote",
    phenotypingCentre: "HMGU",
    sex: "male",
    projectName: "EUMODIC",
    pValue: 0.0000190260549030633,
    lifeStageName: "Early adult",
    effectSize: -1.0642967495069,
    phenotype: {
      id: "MP:0005560",
      name: "decreased circulating glucose level",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005376",
        name: "homeostasis/metabolism phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0000188",
        name: "abnormal circulating glucose level",
      },
      {
        id: "MP:0002078",
        name: "abnormal glucose homeostasis",
      },
      {
        id: "MP:0009642",
        name: "abnormal blood homeostasis",
      },
      {
        id: "MP:0001764",
        name: "abnormal homeostasis",
      },
    ],
    pValue_male: 0.0000190260549030633,
    topLevelPhenotypeName: "homeostasis/metabolism phenotype",
    phenotypeName: "decreased circulating glucose level",
    id: "MP:0005560",
    phenotypeId: "MP:0005560",
    numberOfDatasets: 1,
  },
  {
    datasetId: "67521ef6ce1f2556ff7f8e4f92bf1704",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_DXA_001",
    procedureName: "Body Composition (DEXA lean/fat)",
    parameterStableId: "IMPC_DXA_005_001",
    parameterName: "Bone Mineral Content (excluding skull)",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "not_considered",
    projectName: "DTCC",
    pValue: 0.0000021820240736492,
    lifeStageName: "Early adult",
    effectSize: -2.62752021578882,
    phenotype: {
      id: "MP:0010124",
      name: "decreased bone mineral content",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005390",
        name: "skeleton phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0003795",
        name: "abnormal bone structure",
      },
      {
        id: "MP:0010122",
        name: "abnormal bone mineral content",
      },
      {
        id: "MP:0005508",
        name: "abnormal skeleton morphology",
      },
    ],
    pValue_not_considered: 0.0000021820240736492,
    topLevelPhenotypeName: "skeleton phenotype",
    phenotypeName: "decreased bone mineral content",
    id: "MP:0010124",
    phenotypeId: "MP:0010124",
    numberOfDatasets: 1,
  },
  {
    datasetId: "9c5458ebb19225d1095e25867f0cdf8a",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_HEM_002",
    procedureName: "Hematology",
    parameterStableId: "IMPC_HEM_001_001",
    parameterName: "White blood cell count",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "male",
    projectName: "DTCC",
    pValue: 0.0000239324594499161,
    lifeStageName: "Early adult",
    effectSize: -3.06261223611754,
    phenotype: {
      id: "MP:0000221",
      name: "decreased leukocyte cell number",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005387",
        name: "immune system phenotype",
      },
      {
        id: "MP:0005397",
        name: "hematopoietic system phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0008246",
        name: "abnormal leukocyte morphology",
      },
      {
        id: "MP:0000217",
        name: "abnormal leukocyte cell number",
      },
      {
        id: "MP:0000716",
        name: "abnormal immune system cell morphology",
      },
      {
        id: "MP:0011180",
        name: "abnormal hematopoietic cell number",
      },
      {
        id: "MP:0011182",
        name: "decreased hematopoietic cell number",
      },
      {
        id: "MP:0002396",
        name: "abnormal hematopoietic system morphology/development",
      },
      {
        id: "MP:0000685",
        name: "abnormal immune system morphology",
      },
      {
        id: "MP:0013656",
        name: "abnormal hematopoietic cell morphology",
      },
    ],
    pValue_male: 0.0000239324594499161,
    topLevelPhenotypeName: "immune system phenotype",
    phenotypeName: "decreased leukocyte cell number",
    id: "MP:0000221",
    phenotypeId: "MP:0000221",
    numberOfDatasets: 1,
  },
  {
    datasetId: "4039296f69e7a85a03579c2d34b46dbf",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "GMC_001",
    procedureStableId: "GMC_906_001",
    procedureName: "Clinical chemistry (GMC)",
    parameterStableId: "GMC_906_001_016",
    parameterName: "Alpha-amylase",
    alleleAccessionId: "NOT-RELEASED-d747ce2419",
    alleleName: null,
    alleleSymbol: "Myo6<Tlc>",
    zygosity: "heterozygote",
    phenotypingCentre: "HMGU",
    sex: "male",
    projectName: "EUMODIC",
    pValue: 2.23928129927301e-8,
    lifeStageName: "Early adult",
    effectSize: -2.63057250434272,
    phenotype: {
      id: "MP:0008805",
      name: "decreased circulating amylase level",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005376",
        name: "homeostasis/metabolism phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0005416",
        name: "abnormal circulating protein level",
      },
      {
        id: "MP:0001570",
        name: "abnormal circulating enzyme level",
      },
      {
        id: "MP:0009642",
        name: "abnormal blood homeostasis",
      },
      {
        id: "MP:0008469",
        name: "abnormal protein level",
      },
      {
        id: "MP:0001764",
        name: "abnormal homeostasis",
      },
      {
        id: "MP:0008804",
        name: "abnormal circulating amylase level",
      },
      {
        id: "MP:0005319",
        name: "abnormal enzyme/coenzyme level",
      },
    ],
    pValue_male: 2.23928129927301e-8,
    topLevelPhenotypeName: "homeostasis/metabolism phenotype",
    phenotypeName: "decreased circulating amylase level",
    id: "MP:0008805",
    phenotypeId: "MP:0008805",
    numberOfDatasets: 1,
  },
  {
    datasetId: "e52ec5e222acc5a5eb59cc679fc68af2",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "GMC_001",
    procedureStableId: "GMC_916_001",
    procedureName: "Holeboard (GMC)",
    parameterStableId: "GMC_916_001_018",
    parameterName: "Rearings box",
    alleleAccessionId: "NOT-RELEASED-d747ce2419",
    alleleName: null,
    alleleSymbol: "Myo6<Tlc>",
    zygosity: "heterozygote",
    phenotypingCentre: "HMGU",
    sex: "male",
    projectName: "EUMODIC",
    pValue: 7.73939602256485e-7,
    lifeStageName: "Early adult",
    effectSize: 1.76317956372398,
    phenotype: {
      id: "MP:0002574",
      name: "increased vertical activity",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0001399",
        name: "hyperactivity",
      },
      {
        id: "MP:0020167",
        name: "abnormal vertical activity",
      },
      {
        id: "MP:0001392",
        name: "abnormal locomotor behavior",
      },
      {
        id: "MP:0003491",
        name: "abnormal voluntary movement",
      },
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
    ],
    pValue_male: 7.73939602256485e-7,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "increased vertical activity",
    id: "MP:0002574",
    phenotypeId: "MP:0002574",
    numberOfDatasets: 1,
  },
  {
    datasetId: "542333eab0dfed5df18150d7b2ad30fe",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_PAT_002",
    procedureName: "Gross Pathology and Tissue Collection",
    parameterStableId: "IMPC_PAT_029_002",
    parameterName: "Uterus",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "female",
    projectName: "DTCC",
    pValue: 0,
    lifeStageName: "Early adult",
    effectSize: 1,
    phenotype: {
      id: "MP:0001120",
      name: "abnormal uterus morphology",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005389",
        name: "reproductive system phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0009209",
        name: "abnormal internal female genitalia morphology",
      },
      {
        id: "MP:0002160",
        name: "abnormal reproductive system morphology",
      },
      {
        id: "MP:0009208",
        name: "abnormal female genitalia morphology",
      },
      {
        id: "MP:0001119",
        name: "abnormal female reproductive system morphology",
      },
    ],
    pValue_female: 0,
    topLevelPhenotypeName: "reproductive system phenotype",
    phenotypeName: "abnormal uterus morphology",
    id: "MP:0001120",
    phenotypeId: "MP:0001120",
    numberOfDatasets: 1,
  },
  {
    datasetId: "8e8e7a10f94addce3fa05068d96543ee",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "GMC_001",
    procedureStableId: "GMC_916_001",
    procedureName: "Holeboard (GMC)",
    parameterStableId: "GMC_916_001_021",
    parameterName: "Line crossings",
    alleleAccessionId: "NOT-RELEASED-d747ce2419",
    alleleName: null,
    alleleSymbol: "Myo6<Tlc>",
    zygosity: "heterozygote",
    phenotypingCentre: "HMGU",
    sex: "male",
    projectName: "EUMODIC",
    pValue: 2.76578267682626e-11,
    lifeStageName: "Early adult",
    effectSize: 1.70427342636437,
    phenotype: {
      id: "MP:0001399",
      name: "hyperactivity",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005386",
        name: "behavior/neurological phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0004924",
        name: "abnormal behavior",
      },
      {
        id: "MP:0003491",
        name: "abnormal voluntary movement",
      },
      {
        id: "MP:0002066",
        name: "abnormal motor capabilities/coordination/movement",
      },
    ],
    pValue_male: 2.76578267682626e-11,
    topLevelPhenotypeName: "behavior/neurological phenotype",
    phenotypeName: "hyperactivity",
    id: "MP:0001399",
    phenotypeId: "MP:0001399",
    numberOfDatasets: 1,
  },
  {
    datasetId: "a26ddff88929f0ed34fa45b1d313c7ae",
    mgiGeneAccessionId: "MGI:104785",
    pipelineStableId: "TCP_001",
    procedureStableId: "IMPC_DXA_001",
    procedureName: "Body Composition (DEXA lean/fat)",
    parameterStableId: "IMPC_DXA_006_001",
    parameterName: "Body length",
    alleleAccessionId: "MGI:6257724",
    alleleName:
      "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    alleleSymbol: "Myo6<em1(IMPC)Tcp>",
    zygosity: "homozygote",
    phenotypingCentre: "TCP",
    sex: "female",
    projectName: "DTCC",
    pValue: 2.64985215378251e-12,
    lifeStageName: "Early adult",
    effectSize: -5.1050789387552,
    phenotype: {
      id: "MP:0001258",
      name: "decreased body length",
    },
    topLevelPhenotypes: [
      {
        id: "MP:0005378",
        name: "growth/size/body region phenotype",
      },
    ],
    intermediatePhenotypes: [
      {
        id: "MP:0002089",
        name: "abnormal postnatal growth/weight/body size",
      },
      {
        id: "MP:0001256",
        name: "abnormal body length",
      },
      {
        id: "MP:0003956",
        name: "abnormal body size",
      },
      {
        id: "MP:0001265",
        name: "decreased body size",
      },
    ],
    pValue_female: 2.64985215378251e-12,
    topLevelPhenotypeName: "growth/size/body region phenotype",
    phenotypeName: "decreased body length",
    id: "MP:0001258",
    phenotypeId: "MP:0001258",
    numberOfDatasets: 1,
  },
];

describe("Gene Significant Phenotypes component", () => {
  it("should render correctly", async () => {
    const { container } = render(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneSignificantPhenotypes
          phenotypeData={data}
          hasDataRelatedToPWG={false}
        />
      </GeneContext.Provider>
    );
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it("should be able to user filter and sort data", async () => {
    const user = userEvent.setup();
    render(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneSignificantPhenotypes
          phenotypeData={data}
          hasDataRelatedToPWG={false}
        />
      </GeneContext.Provider>
    );
    const textInput = screen.getByLabelText("Filter by parameters");
    await user.type(textInput, "abnormal");
    await waitFor(() => expect(screen.getAllByRole("row").length).toBe(9));
    const pValueHeader = screen.getByRole("button", {
      name: "Significant P-value",
    });
    await user.click(pValueHeader);
    await waitFor(() => {
      const firstRow = screen.getAllByRole("row")[2];
      const cells = getAllByRole(firstRow, "cell");
      const lastCell = cells[cells.length - 1];
      expect(lastCell.textContent.trim()).toBe("1.94x10-16");
    });
    const phySystemSelector = screen.getByLabelText("Phy. System:");
    await user.selectOptions(phySystemSelector, [
      "behavior/neurological phenotype",
    ]);
    await waitFor(() => expect(screen.getAllByRole("row").length).toBe(5));
    await user.clear(textInput);
    const alleleSelector = screen.getByLabelText("Allele:");
    await user.selectOptions(alleleSelector, ["Myo6<em1(IMPC)Tcp>"]);
    const zygositySelector = screen.getByLabelText("Zygosity:");
    await user.selectOptions(zygositySelector, ["homozygote"]);
    await waitFor(() => expect(screen.getAllByRole("row").length).toBe(10));
  });

  it("on receiving system selection event, sets the correct ph. system", async () => {
    const onSpy = jest.spyOn(summarySystemSelectionChannel, "on");
    render(
      <GeneContext.Provider value={gene as GeneSummary}>
        <GeneSignificantPhenotypes
          phenotypeData={data}
          hasDataRelatedToPWG={false}
        />
      </GeneContext.Provider>
    );
    act(() =>
      summarySystemSelectionChannel.emit(
        "onSystemSelection",
        "growth/size/body region phenotype"
      )
    );
    expect(onSpy).toHaveBeenCalledTimes(1);
    const selectedOption: HTMLOptionElement = await screen.findByRole(
      "option",
      { name: "growth/size/body region phenotype" }
    );
    expect(selectedOption.selected).toBeTruthy();
    await waitFor(() => expect(screen.getAllByRole("row").length).toBe(6));
  });
});
