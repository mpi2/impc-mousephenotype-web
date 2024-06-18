import { render, screen, waitFor } from '@testing-library/react';
import ViabilityDataComparison from "@/components/Data/DataComparison/ViabilityDataComparison";
import { Dataset } from "@/models";
import userEvent from "@testing-library/user-event";
import DataComparison from "../../../components/Data/DataComparison";

const datasets: Array<Dataset> = [
  {
    "id": "6661788676a6963460a1dd19",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Heterozygous animals viability",
    "parameterStableId": "IMPC_VIA_066_001",
    "parameterStableKey": 72012,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "heterozygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "67aee48868f22b725f96992756d811d4",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "66617a3b3b37c5f4e2df3093",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Heterozygous animals viability",
    "parameterStableId": "IMPC_VIA_066_001",
    "parameterStableKey": 72012,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "heterozygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "67aee48868f22b725f96992756d811d4",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "66617a6651286adeeef1768f",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Homozygous males viability",
    "parameterStableId": "IMPC_VIA_063_001",
    "parameterStableKey": 72009,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "homozygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "9deeb0258d5159af7911eebdc0ba2ed3",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "66617bf2af61d85412a674a8",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Hemizygous males viability",
    "parameterStableId": "IMPC_VIA_065_001",
    "parameterStableKey": 72011,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "hemizygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "cbb509063ddc1245da18db2beffea24c",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "66617c0cd58174669612e005",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Hemizygous males viability",
    "parameterStableId": "IMPC_VIA_065_001",
    "parameterStableKey": 72011,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "hemizygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "cbb509063ddc1245da18db2beffea24c",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "66617d19329998a4e2adf999",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Homozygous females viability",
    "parameterStableId": "IMPC_VIA_064_001",
    "parameterStableKey": 72010,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "homozygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "fd6e651093686b2e79b5e22148875bb0",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "6661860e4aee4e6f5255a6a6",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Homozygous females viability",
    "parameterStableId": "IMPC_VIA_064_001",
    "parameterStableKey": 72010,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "homozygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "fd6e651093686b2e79b5e22148875bb0",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "6661886c67a0fa68fe928284",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Homozygous males viability",
    "parameterStableId": "IMPC_VIA_063_001",
    "parameterStableKey": 72009,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "homozygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "9deeb0258d5159af7911eebdc0ba2ed3",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "66618e6cb56b7879f32c82f9",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Homozygous animals viability",
    "parameterStableId": "IMPC_VIA_067_001",
    "parameterStableKey": 72013,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "homozygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "ee920c8e2902888187069935c64c2395",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  },
  {
    "id": "66618f14c3c93775aafc8acf",
    "alleleAccessionId": "MGI:6257724",
    "alleleName": "endonuclease-mediated mutation 1, The Centre for Phenogenomics",
    "alleleSymbol": "Myo6<em1(IMPC)Tcp>",
    "classificationTag": null,
    "colonyId": "TCPR0947_ADUP",
    "dataType": "line",
    "geneSymbol": "Myo6",
    "geneticBackground": "involves: C57BL/6NCrl",
    "intermediatePhenotypes": [
      {
        "name": "abnormal survival",
        "id": "MP:0010769"
      },
      {
        "name": "preweaning lethality",
        "id": "MP:0010770"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of pups at genotype = 2|Female parents genotype = Heterozygous|Gene category = Autosomal|Male parents genotype = Heterozygous"
    ],
    "mgiGeneAccessionId": "MGI:104785",
    "parameterName": "Homozygous animals viability",
    "parameterStableId": "IMPC_VIA_067_001",
    "parameterStableKey": 72013,
    "phenotypeSex": null,
    "phenotypingCentre": "TCP",
    "pipelineName": "TCP Pipeline",
    "pipelineStableId": "TCP_001",
    "pipelineStableKey": 9,
    "potentialPhenotypes": [
      {
        "name": "preweaning lethality, complete penetrance",
        "id": "MP:0011100"
      },
      {
        "name": "preweaning lethality, incomplete penetrance",
        "id": "MP:0011110"
      }
    ],
    "procedureGroup": "IMPC_VIA",
    "procedureName": "Viability Primary Screen",
    "procedureStableId": "IMPC_VIA_002",
    "procedureStableKey": 1267,
    "productionCentre": null,
    "projectName": "DTCC",
    "reportedEffectSize": 0,
    "reportedPValue": 1,
    "unit": {
      "x": " ",
      "y": null
    },
    "resourceFullName": "IMPC",
    "resourceName": "IMPC",
    "sex": null,
    "zygosity": "homozygote",
    "significant": false,
    "significantPhenotype": null,
    "softWindowing": {
      "bandwidth": null,
      "doeNote": null,
      "minObsRequired": null,
      "numberOfDoe": null,
      "peaks": null,
      "shape": null,
      "threshold": null,
      "totalObsOrWeight": null
    },
    "statisticalMethod": {
      "name": "Supplied as data",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": null,
        "femaleKoEffectStderrEstimate": null,
        "femaleKoParameterEstimate": null,
        "femalePercentageChange": null,
        "maleKoEffectPValue": null,
        "maleKoEffectStderrEstimate": null,
        "maleKoParameterEstimate": null,
        "malePercentageChange": null,
        "genotypeEffectPValue": null,
        "genotypeEffectStderrEstimate": null,
        "group1Genotype": null,
        "group1ResidualsNormalityTest": null,
        "group2Genotype": null,
        "group2ResidualsNormalityTest": null,
        "interactionEffectPValue": null,
        "interactionSignificant": null,
        "interceptEstimate": null,
        "interceptEstimateStderrEstimate": null,
        "maleEffectSize": null,
        "sexEffectPValue": null,
        "sexEffectParameterEstimate": null,
        "sexEffectStderrEstimate": null,
        "batchSignificant": null,
        "varianceSignificant": null
      }
    },
    "datasetId": "ee920c8e2902888187069935c64c2395",
    "status": "Successful",
    "strainAccessionId": "MGI:2683688",
    "strainName": "C57BL/6NCrl",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": null,
      "femaleControlMean": null,
      "femaleControlSd": null,
      "femaleMutantCount": null,
      "femaleMutantMean": null,
      "femaleMutantSd": null,
      "maleControlCount": null,
      "maleControlMean": null,
      "maleControlSd": null,
      "maleMutantCount": null,
      "maleMutantMean": null,
      "maleMutantSd": null
    },
    "topLevelPhenotypes": [
      {
        "name": "mortality/aging",
        "id": "MP:0010768"
      }
    ]
  }
];

describe('Viability data comparison component', () => {
  it('renders deduplicated data', async () => {
    render(<ViabilityDataComparison data={datasets} />);
    const rows = await screen.findAllByRole('row');
    // 6 because includes the header ones
    expect(rows.length).toEqual(7);
    const headers = await screen.findAllByRole('columnheader');
    expect(headers.length).toEqual(7);
  });

  it('automatically selects the first row if not provided from props', async () => {
    const selectParamMock = jest.fn();
    render(<ViabilityDataComparison data={datasets} onSelectParam={selectParamMock} selectedKey={""} />);
    await waitFor(() => {
      expect(selectParamMock).toHaveBeenCalled();
    });
  });

  it('emits the key of the row if the users clicks on it', async () => {
    const user = userEvent.setup();
    const selectParamMock = jest.fn();
    render(<ViabilityDataComparison data={datasets} onSelectParam={selectParamMock} selectedKey={""} />);
    const rows = await screen.findAllByRole('row');
    // first 2 are the header ones
    await user.click(rows[4]);
    await waitFor(() => {
      expect(selectParamMock).toHaveBeenCalledTimes(2);
      expect(selectParamMock).toHaveBeenLastCalledWith(
        "-MGI:6257724-IMPC_VIA_065_001-hemizygote-TCP-TCPR0947_ADUP-Early adult-null"
      );
    });
  });
});