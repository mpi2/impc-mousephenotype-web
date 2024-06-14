import { render, screen, waitFor } from '@testing-library/react';
import DataComparison from "@/components/Data/DataComparison";
import { Dataset } from "@/models";
import userEvent from "@testing-library/user-event";

const datasets: Array<Dataset> = [
  {
    "id": "6661818ac8e8e4175fe39cce",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  5.15607909123972e-06 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = TSE|Equipment model = 602000-HP-AD|Equipment name = HOTPLATE 602000|Type of recording = Automatic"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body Weight",
    "parameterStableId": "M-G-P_012_001_005",
    "parameterStableKey": 982,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_012",
    "procedureName": "Hot Plate",
    "procedureStableId": "M-G-P_012_001",
    "procedureStableKey": 47,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": -2.07964281036501,
    "reportedPValue": 0.00000515607909123972,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14902,
        14935,
        14937,
        14953,
        14972,
        15035,
        15182,
        15189
      ],
      "shape": 5.42604853784322,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1094
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": -2.37574758021725,
        "femaleKoEffectPValue": 0.00000515607909123593,
        "femaleKoEffectStderrEstimate": 1.37681779021652,
        "femaleKoParameterEstimate": -6.31015880999219,
        "femalePercentageChange": -52.1696893808358,
        "maleKoEffectPValue": 9.83281266253559e-11,
        "maleKoEffectStderrEstimate": 1.64118236964492,
        "maleKoParameterEstimate": -10.7318552275807,
        "malePercentageChange": -241.755919777335,
        "genotypeEffectPValue": 0.00000515607909123972,
        "genotypeEffectStderrEstimate": 1.37681779021652,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0504698468714892,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.787347061002673,
        "interactionEffectPValue": 0.0393024776463919,
        "interactionSignificant": true,
        "interceptEstimate": 28.0069494152994,
        "interceptEstimateStderrEstimate": 0.181529671104819,
        "maleEffectSize": -3.70444991102135,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.428191964243,
        "sexEffectStderrEstimate": 0.185166591066912,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "269a3e53f710c3a60a002bdbd029404f",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 567,
      "femaleControlMean": 28.0552028218695,
      "femaleControlSd": 3.31229163666976,
      "femaleMutantCount": 5,
      "femaleMutantMean": 20.86,
      "femaleMutantSd": 2.28538836962123,
      "maleControlCount": 598,
      "maleControlMean": 34.4113712374582,
      "maleControlSd": 3.16844858854721,
      "maleMutantCount": 4,
      "maleMutantMean": 23.525,
      "maleMutantSd": 1.13541475535007
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "666183ebc260574aa6e88b47",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  5.15607909123972e-06 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = TSE|Equipment model = 602000-HP-AD|Equipment name = HOTPLATE 602000|Type of recording = Automatic"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body Weight",
    "parameterStableId": "M-G-P_012_001_005",
    "parameterStableKey": 982,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_012",
    "procedureName": "Hot Plate",
    "procedureStableId": "M-G-P_012_001",
    "procedureStableKey": 47,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": -2.07964281036501,
    "reportedPValue": 0.00000515607909123972,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14902,
        14935,
        14937,
        14953,
        14972,
        15035,
        15182,
        15189
      ],
      "shape": 5.42604853784322,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1094
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": -2.37574758021725,
        "femaleKoEffectPValue": 0.00000515607909123593,
        "femaleKoEffectStderrEstimate": 1.37681779021652,
        "femaleKoParameterEstimate": -6.31015880999219,
        "femalePercentageChange": -52.1696893808358,
        "maleKoEffectPValue": 9.83281266253559e-11,
        "maleKoEffectStderrEstimate": 1.64118236964492,
        "maleKoParameterEstimate": -10.7318552275807,
        "malePercentageChange": -241.755919777335,
        "genotypeEffectPValue": 0.00000515607909123972,
        "genotypeEffectStderrEstimate": 1.37681779021652,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0504698468714892,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.787347061002673,
        "interactionEffectPValue": 0.0393024776463919,
        "interactionSignificant": true,
        "interceptEstimate": 28.0069494152994,
        "interceptEstimateStderrEstimate": 0.181529671104819,
        "maleEffectSize": -3.70444991102135,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.428191964243,
        "sexEffectStderrEstimate": 0.185166591066912,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "269a3e53f710c3a60a002bdbd029404f",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 567,
      "femaleControlMean": 28.0552028218695,
      "femaleControlSd": 3.31229163666976,
      "femaleMutantCount": 5,
      "femaleMutantMean": 20.86,
      "femaleMutantSd": 2.28538836962123,
      "maleControlCount": 598,
      "maleControlMean": 34.4113712374582,
      "maleControlSd": 3.16844858854721,
      "maleMutantCount": 4,
      "maleMutantMean": 23.525,
      "maleMutantSd": 1.13541475535007
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "666189cf3979abfdab122bc2",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  5.15607909123972e-06 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = TSE|Equipment model = 602000-HP-AD|Equipment name = HOTPLATE 602000|Type of recording = Automatic"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body Weight",
    "parameterStableId": "M-G-P_012_001_005",
    "parameterStableKey": 982,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_012",
    "procedureName": "Hot Plate",
    "procedureStableId": "M-G-P_012_001",
    "procedureStableKey": 47,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": -2.07964281036501,
    "reportedPValue": 0.00000515607909123972,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14902,
        14935,
        14937,
        14953,
        14972,
        15035,
        15182,
        15189
      ],
      "shape": 5.42604853784322,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1094
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": -2.37574758021725,
        "femaleKoEffectPValue": 0.00000515607909123593,
        "femaleKoEffectStderrEstimate": 1.37681779021652,
        "femaleKoParameterEstimate": -6.31015880999219,
        "femalePercentageChange": -52.1696893808358,
        "maleKoEffectPValue": 9.83281266253559e-11,
        "maleKoEffectStderrEstimate": 1.64118236964492,
        "maleKoParameterEstimate": -10.7318552275807,
        "malePercentageChange": -241.755919777335,
        "genotypeEffectPValue": 0.00000515607909123972,
        "genotypeEffectStderrEstimate": 1.37681779021652,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0504698468714892,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.787347061002673,
        "interactionEffectPValue": 0.0393024776463919,
        "interactionSignificant": true,
        "interceptEstimate": 28.0069494152994,
        "interceptEstimateStderrEstimate": 0.181529671104819,
        "maleEffectSize": -3.70444991102135,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.428191964243,
        "sexEffectStderrEstimate": 0.185166591066912,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "269a3e53f710c3a60a002bdbd029404f",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 567,
      "femaleControlMean": 28.0552028218695,
      "femaleControlSd": 3.31229163666976,
      "femaleMutantCount": 5,
      "femaleMutantMean": 20.86,
      "femaleMutantSd": 2.28538836962123,
      "maleControlCount": 598,
      "maleControlMean": 34.4113712374582,
      "maleControlSd": 3.16844858854721,
      "maleMutantCount": 4,
      "maleMutantMean": 23.525,
      "maleMutantSd": 1.13541475535007
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "66617892b2b2f59036afa0c9",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally insignificant [level =  1e-04 , pvalue =  0.000116599744337975 ]; but with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = BIOSEB|Equipment model = BIO-GT3+MR|Equipment name = GRIPTEST V3.11"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body weight",
    "parameterStableId": "M-G-P_009_001_003",
    "parameterStableKey": 973,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_009",
    "procedureName": "Grip Strength",
    "procedureStableId": "M-G-P_009_001",
    "procedureStableKey": 46,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": null,
    "reportedPValue": 0.000116599744337975,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "male",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 490,
      "numberOfDoe": 7,
      "peaks": [
        14897,
        14930,
        14946,
        14964,
        15028,
        15177,
        15184
      ],
      "shape": 5.42604853784322,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1187
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": 0.000116599744338029,
        "femaleKoEffectStderrEstimate": 1.34143321603389,
        "femaleKoParameterEstimate": -5.18820420810391,
        "femalePercentageChange": null,
        "maleKoEffectPValue": 4.40186116350873e-8,
        "maleKoEffectStderrEstimate": 1.63167655640131,
        "maleKoParameterEstimate": -8.99749519324144,
        "malePercentageChange": null,
        "genotypeEffectPValue": 0.000116599744337975,
        "genotypeEffectStderrEstimate": 1.34143321603389,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.242626319772099,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.712582268425547,
        "interactionEffectPValue": 0.0714093255774477,
        "interactionSignificant": true,
        "interceptEstimate": 25.8924723380175,
        "interceptEstimateStderrEstimate": 0.17431831839026,
        "maleEffectSize": null,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.66075043114357,
        "sexEffectStderrEstimate": 0.167228354267239,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "65770730dbd7ea2deae93781e5088ebe",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 615,
      "femaleControlMean": 26.0079674796748,
      "femaleControlSd": 3.21786315064356,
      "femaleMutantCount": 5,
      "femaleMutantMean": 20,
      "femaleMutantSd": 1.99374020373769,
      "maleControlCount": 646,
      "maleControlMean": 32.5823529411765,
      "maleControlSd": 3.09705006518254,
      "maleMutantCount": 4,
      "maleMutantMean": 22.6,
      "maleMutantSd": 1.23827837473378
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "66617df1abbbf8f2799feda1",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally insignificant [level =  1e-04 , pvalue =  0.000116599744337975 ]; but with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = BIOSEB|Equipment model = BIO-GT3+MR|Equipment name = GRIPTEST V3.11"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body weight",
    "parameterStableId": "M-G-P_009_001_003",
    "parameterStableKey": 973,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_009",
    "procedureName": "Grip Strength",
    "procedureStableId": "M-G-P_009_001",
    "procedureStableKey": 46,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": null,
    "reportedPValue": 0.000116599744337975,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "male",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 490,
      "numberOfDoe": 7,
      "peaks": [
        14897,
        14930,
        14946,
        14964,
        15028,
        15177,
        15184
      ],
      "shape": 5.42604853784322,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1187
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": 0.000116599744338029,
        "femaleKoEffectStderrEstimate": 1.34143321603389,
        "femaleKoParameterEstimate": -5.18820420810391,
        "femalePercentageChange": null,
        "maleKoEffectPValue": 4.40186116350873e-8,
        "maleKoEffectStderrEstimate": 1.63167655640131,
        "maleKoParameterEstimate": -8.99749519324144,
        "malePercentageChange": null,
        "genotypeEffectPValue": 0.000116599744337975,
        "genotypeEffectStderrEstimate": 1.34143321603389,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.242626319772099,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.712582268425547,
        "interactionEffectPValue": 0.0714093255774477,
        "interactionSignificant": true,
        "interceptEstimate": 25.8924723380175,
        "interceptEstimateStderrEstimate": 0.17431831839026,
        "maleEffectSize": null,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.66075043114357,
        "sexEffectStderrEstimate": 0.167228354267239,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "65770730dbd7ea2deae93781e5088ebe",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 615,
      "femaleControlMean": 26.0079674796748,
      "femaleControlSd": 3.21786315064356,
      "femaleMutantCount": 5,
      "femaleMutantMean": 20,
      "femaleMutantSd": 1.99374020373769,
      "maleControlCount": 646,
      "maleControlMean": 32.5823529411765,
      "maleControlSd": 3.09705006518254,
      "maleMutantCount": 4,
      "maleMutantMean": 22.6,
      "maleMutantSd": 1.23827837473378
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "66618b557f98d268e167e1ce",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally insignificant [level =  1e-04 , pvalue =  0.000116599744337975 ]; but with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = BIOSEB|Equipment model = BIO-GT3+MR|Equipment name = GRIPTEST V3.11"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body weight",
    "parameterStableId": "M-G-P_009_001_003",
    "parameterStableKey": 973,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_009",
    "procedureName": "Grip Strength",
    "procedureStableId": "M-G-P_009_001",
    "procedureStableKey": 46,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": null,
    "reportedPValue": 0.000116599744337975,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "male",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 490,
      "numberOfDoe": 7,
      "peaks": [
        14897,
        14930,
        14946,
        14964,
        15028,
        15177,
        15184
      ],
      "shape": 5.42604853784322,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1187
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": 0.000116599744338029,
        "femaleKoEffectStderrEstimate": 1.34143321603389,
        "femaleKoParameterEstimate": -5.18820420810391,
        "femalePercentageChange": null,
        "maleKoEffectPValue": 4.40186116350873e-8,
        "maleKoEffectStderrEstimate": 1.63167655640131,
        "maleKoParameterEstimate": -8.99749519324144,
        "malePercentageChange": null,
        "genotypeEffectPValue": 0.000116599744337975,
        "genotypeEffectStderrEstimate": 1.34143321603389,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.242626319772099,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.712582268425547,
        "interactionEffectPValue": 0.0714093255774477,
        "interactionSignificant": true,
        "interceptEstimate": 25.8924723380175,
        "interceptEstimateStderrEstimate": 0.17431831839026,
        "maleEffectSize": null,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.66075043114357,
        "sexEffectStderrEstimate": 0.167228354267239,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "65770730dbd7ea2deae93781e5088ebe",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 615,
      "femaleControlMean": 26.0079674796748,
      "femaleControlSd": 3.21786315064356,
      "femaleMutantCount": 5,
      "femaleMutantMean": 20,
      "femaleMutantSd": 1.99374020373769,
      "maleControlCount": 646,
      "maleControlMean": 32.5823529411765,
      "maleControlSd": 3.09705006518254,
      "maleMutantCount": 4,
      "maleMutantMean": 22.6,
      "maleMutantSd": 1.23827837473378
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "66617fd137be08bc80f4c567",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  3.1050294134749e-06 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of mice when culled = 110|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 111|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 113|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 112|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 109|Histology performed = no|Pipeline No = 5"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body Weight",
    "parameterStableId": "M-G-P_020_001_001",
    "parameterStableKey": 1247,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_020",
    "procedureName": "Heart Dissection",
    "procedureStableId": "M-G-P_020_001",
    "procedureStableKey": 59,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": null,
    "reportedPValue": 0.0000031050294134749,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14943,
        14978,
        14980,
        14994,
        15013,
        15077,
        15224,
        15231
      ],
      "shape": 8.32424976078166,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1177
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": 0.00000310502941346854,
        "femaleKoEffectStderrEstimate": 1.51079744152969,
        "femaleKoParameterEstimate": -7.08318590834035,
        "femalePercentageChange": null,
        "maleKoEffectPValue": 5.70586924425043e-14,
        "maleKoEffectStderrEstimate": 1.69834430998519,
        "maleKoParameterEstimate": -12.9338796627605,
        "malePercentageChange": null,
        "genotypeEffectPValue": 0.0000031050294134749,
        "genotypeEffectStderrEstimate": 1.51079744152969,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0491248558498714,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.906427551577738,
        "interactionEffectPValue": 0.0100708194706594,
        "interactionSignificant": true,
        "interceptEstimate": 33.3031691301426,
        "interceptEstimateStderrEstimate": 0.179112466335265,
        "maleEffectSize": null,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.08938984011451,
        "sexEffectStderrEstimate": 0.18913499571601,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "89e81676c0bd477c2df2d88c9081b04d",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 611,
      "femaleControlMean": 33.3428805237316,
      "femaleControlSd": 3.38027463485047,
      "femaleMutantCount": 5,
      "femaleMutantMean": 26.34,
      "femaleMutantSd": 4.15728276642328,
      "maleControlCount": 642,
      "maleControlMean": 39.2870716510903,
      "maleControlSd": 3.46704626737676,
      "maleMutantCount": 4,
      "maleMutantMean": 25.95,
      "maleMutantSd": 1.8645821694596
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "666182b557f405beb0fefc43",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  3.1050294134749e-06 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of mice when culled = 110|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 111|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 113|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 112|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 109|Histology performed = no|Pipeline No = 5"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body Weight",
    "parameterStableId": "M-G-P_020_001_001",
    "parameterStableKey": 1247,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_020",
    "procedureName": "Heart Dissection",
    "procedureStableId": "M-G-P_020_001",
    "procedureStableKey": 59,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": null,
    "reportedPValue": 0.0000031050294134749,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14943,
        14978,
        14980,
        14994,
        15013,
        15077,
        15224,
        15231
      ],
      "shape": 8.32424976078166,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1177
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": 0.00000310502941346854,
        "femaleKoEffectStderrEstimate": 1.51079744152969,
        "femaleKoParameterEstimate": -7.08318590834035,
        "femalePercentageChange": null,
        "maleKoEffectPValue": 5.70586924425043e-14,
        "maleKoEffectStderrEstimate": 1.69834430998519,
        "maleKoParameterEstimate": -12.9338796627605,
        "malePercentageChange": null,
        "genotypeEffectPValue": 0.0000031050294134749,
        "genotypeEffectStderrEstimate": 1.51079744152969,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0491248558498714,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.906427551577738,
        "interactionEffectPValue": 0.0100708194706594,
        "interactionSignificant": true,
        "interceptEstimate": 33.3031691301426,
        "interceptEstimateStderrEstimate": 0.179112466335265,
        "maleEffectSize": null,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.08938984011451,
        "sexEffectStderrEstimate": 0.18913499571601,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "89e81676c0bd477c2df2d88c9081b04d",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 611,
      "femaleControlMean": 33.3428805237316,
      "femaleControlSd": 3.38027463485047,
      "femaleMutantCount": 5,
      "femaleMutantMean": 26.34,
      "femaleMutantSd": 4.15728276642328,
      "maleControlCount": 642,
      "maleControlMean": 39.2870716510903,
      "maleControlSd": 3.46704626737676,
      "maleMutantCount": 4,
      "maleMutantMean": 25.95,
      "maleMutantSd": 1.8645821694596
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "66618910e2a65a42a59b2116",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  3.1050294134749e-06 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Age of mice when culled = 110|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 111|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 113|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 112|Histology performed = no|Pipeline No = 5",
      "Age of mice when culled = 109|Histology performed = no|Pipeline No = 5"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Body Weight",
    "parameterStableId": "M-G-P_020_001_001",
    "parameterStableKey": 1247,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_020",
    "procedureName": "Heart Dissection",
    "procedureStableId": "M-G-P_020_001",
    "procedureStableKey": 59,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": null,
    "reportedPValue": 0.0000031050294134749,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 221,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14943,
        14978,
        14980,
        14994,
        15013,
        15077,
        15224,
        15231
      ],
      "shape": 8.32424976078166,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 1177
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": null,
        "femaleKoEffectPValue": 0.00000310502941346854,
        "femaleKoEffectStderrEstimate": 1.51079744152969,
        "femaleKoParameterEstimate": -7.08318590834035,
        "femalePercentageChange": null,
        "maleKoEffectPValue": 5.70586924425043e-14,
        "maleKoEffectStderrEstimate": 1.69834430998519,
        "maleKoParameterEstimate": -12.9338796627605,
        "malePercentageChange": null,
        "genotypeEffectPValue": 0.0000031050294134749,
        "genotypeEffectStderrEstimate": 1.51079744152969,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0491248558498714,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.906427551577738,
        "interactionEffectPValue": 0.0100708194706594,
        "interactionSignificant": true,
        "interceptEstimate": 33.3031691301426,
        "interceptEstimateStderrEstimate": 0.179112466335265,
        "maleEffectSize": null,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.08938984011451,
        "sexEffectStderrEstimate": 0.18913499571601,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "89e81676c0bd477c2df2d88c9081b04d",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 611,
      "femaleControlMean": 33.3428805237316,
      "femaleControlSd": 3.38027463485047,
      "femaleMutantCount": 5,
      "femaleMutantMean": 26.34,
      "femaleMutantSd": 4.15728276642328,
      "maleControlCount": 642,
      "maleControlMean": 39.2870716510903,
      "maleControlSd": 3.46704626737676,
      "maleMutantCount": 4,
      "maleMutantMean": 25.95,
      "maleMutantSd": 1.8645821694596
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "6661818b882c26062b9daca0",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  1.58218813239852e-05 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = GE LUNAR|Equipment model = Lunar PIXImus 2|Equipment name = Densitometer|Mouse Status = Anaesthetised"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Weight",
    "parameterStableId": "M-G-P_005_001_001",
    "parameterStableKey": 1043,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_005",
    "procedureName": "Dexa-scan analysis",
    "procedureStableId": "M-G-P_005_001",
    "procedureStableKey": 51,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": -2.2471113543747,
    "reportedPValue": 0.0000158218813239852,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 49,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14930,
        14963,
        14964,
        14981,
        14998,
        15061,
        15211,
        15217
      ],
      "shape": 1.8053203938205,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 720
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": -2.26897436874991,
        "femaleKoEffectPValue": 0.0000158218813240424,
        "femaleKoEffectStderrEstimate": 1.4483780828355,
        "femaleKoParameterEstimate": -6.29899480128893,
        "femalePercentageChange": -147.078662616041,
        "maleKoEffectPValue": 1.64795021095271e-13,
        "maleKoEffectStderrEstimate": 1.64190026211007,
        "maleKoParameterEstimate": -12.36505744493,
        "malePercentageChange": -256.872587706567,
        "genotypeEffectPValue": 0.0000158218813239852,
        "genotypeEffectStderrEstimate": 1.4483780828355,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0014558534231195,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.144759462554536,
        "interactionEffectPValue": 0.00562639936289155,
        "interactionSignificant": true,
        "interceptEstimate": 32.460313157981,
        "interceptEstimateStderrEstimate": 0.250943404199493,
        "maleEffectSize": -4.01896977446764,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.27323240671175,
        "sexEffectStderrEstimate": 0.243558733793172,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "8b6a95e247700a808f592b43a6cfdfcf",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 613,
      "femaleControlMean": 32.515660685155,
      "femaleControlSd": 3.31076419742509,
      "femaleMutantCount": 5,
      "femaleMutantMean": 25.64,
      "femaleMutantSd": 3.70580625505436,
      "maleControlCount": 644,
      "maleControlMean": 38.5026397515528,
      "maleControlSd": 3.32183630577072,
      "maleMutantCount": 4,
      "maleMutantMean": 25.8,
      "maleMutantSd": 1.56843871413581
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "666189dea7d8863a3c56e376",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  1.58218813239852e-05 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = GE LUNAR|Equipment model = Lunar PIXImus 2|Equipment name = Densitometer|Mouse Status = Anaesthetised"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Weight",
    "parameterStableId": "M-G-P_005_001_001",
    "parameterStableKey": 1043,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_005",
    "procedureName": "Dexa-scan analysis",
    "procedureStableId": "M-G-P_005_001",
    "procedureStableKey": 51,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": -2.2471113543747,
    "reportedPValue": 0.0000158218813239852,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 49,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14930,
        14963,
        14964,
        14981,
        14998,
        15061,
        15211,
        15217
      ],
      "shape": 1.8053203938205,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 720
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": -2.26897436874991,
        "femaleKoEffectPValue": 0.0000158218813240424,
        "femaleKoEffectStderrEstimate": 1.4483780828355,
        "femaleKoParameterEstimate": -6.29899480128893,
        "femalePercentageChange": -147.078662616041,
        "maleKoEffectPValue": 1.64795021095271e-13,
        "maleKoEffectStderrEstimate": 1.64190026211007,
        "maleKoParameterEstimate": -12.36505744493,
        "malePercentageChange": -256.872587706567,
        "genotypeEffectPValue": 0.0000158218813239852,
        "genotypeEffectStderrEstimate": 1.4483780828355,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0014558534231195,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.144759462554536,
        "interactionEffectPValue": 0.00562639936289155,
        "interactionSignificant": true,
        "interceptEstimate": 32.460313157981,
        "interceptEstimateStderrEstimate": 0.250943404199493,
        "maleEffectSize": -4.01896977446764,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.27323240671175,
        "sexEffectStderrEstimate": 0.243558733793172,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "8b6a95e247700a808f592b43a6cfdfcf",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 613,
      "femaleControlMean": 32.515660685155,
      "femaleControlSd": 3.31076419742509,
      "femaleMutantCount": 5,
      "femaleMutantMean": 25.64,
      "femaleMutantSd": 3.70580625505436,
      "maleControlCount": 644,
      "maleControlMean": 38.5026397515528,
      "maleControlSd": 3.32183630577072,
      "maleMutantCount": 4,
      "maleMutantMean": 25.8,
      "maleMutantSd": 1.56843871413581
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  },
  {
    "id": "66618cd81cd38acfaef002ae",
    "alleleAccessionId": "MGI:4363390",
    "alleleName": "targeted mutation 1a, Wellcome Trust Sanger Institute",
    "alleleSymbol": "Dbn1<tm1a(KOMP)Wtsi>",
    "classificationTag": "Overally significant [level =  1e-04 , pvalue =  1.58218813239852e-05 ]; and with phenotype threshold value 1e-04 - different size as males greater",
    "colonyId": "EPD0211_3_A05",
    "dataType": "unidimensional",
    "geneSymbol": "Dbn1",
    "geneticBackground": "involves: C57BL/6N",
    "intermediatePhenotypes": [
      {
        "name": "abnormal body size",
        "id": "MP:0003956"
      },
      {
        "name": "abnormal total tissue mass",
        "id": "MP:0012321"
      },
      {
        "name": "abnormal body composition",
        "id": "MP:0005451"
      },
      {
        "name": "decreased body size",
        "id": "MP:0001265"
      },
      {
        "name": "abnormal postnatal growth/weight/body size",
        "id": "MP:0002089"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "decreased total tissue mass",
        "id": "MP:0012322"
      }
    ],
    "lifeStageAcc": "IMPCLS:0005",
    "lifeStageName": "Early adult",
    "metadataGroup": "d41d8cd98f00b204e9800998ecf8427e",
    "metadataValues": [
      "Equipment manufacturer = GE LUNAR|Equipment model = Lunar PIXImus 2|Equipment name = Densitometer|Mouse Status = Anaesthetised"
    ],
    "mgiGeneAccessionId": "MGI:1931838",
    "parameterName": "Weight",
    "parameterStableId": "M-G-P_005_001_001",
    "parameterStableKey": 1043,
    "phenotypeSex": [
      "male",
      "female"
    ],
    "phenotypingCentre": "WTSI",
    "pipelineName": "MGP Pipeline",
    "pipelineStableId": "M-G-P_001",
    "pipelineStableKey": 4,
    "potentialPhenotypes": [
      {
        "name": "decreased body weight",
        "id": "MP:0001262"
      },
      {
        "name": "abnormal body weight",
        "id": "MP:0001259"
      },
      {
        "name": "increased body weight",
        "id": "MP:0001260"
      }
    ],
    "procedureGroup": "M-G-P_005",
    "procedureName": "Dexa-scan analysis",
    "procedureStableId": "M-G-P_005_001",
    "procedureStableKey": 51,
    "productionCentre": "WTSI",
    "projectName": "MGP",
    "reportedEffectSize": -2.2471113543747,
    "reportedPValue": 0.0000158218813239852,
    "unit": {
      "x": "g",
      "y": null
    },
    "resourceFullName": "MGP",
    "resourceName": "MGP",
    "sex": "not_considered",
    "zygosity": "homozygote",
    "significant": true,
    "significantPhenotype": {
      "name": "decreased body weight",
      "id": "MP:0001262"
    },
    "softWindowing": {
      "bandwidth": 49,
      "doeNote": "no note available",
      "minObsRequired": 560,
      "numberOfDoe": 8,
      "peaks": [
        14930,
        14963,
        14964,
        14981,
        14998,
        15061,
        15211,
        15217
      ],
      "shape": 1.8053203938205,
      "threshold": 1.49011611938477e-7,
      "totalObsOrWeight": 720
    },
    "statisticalMethod": {
      "name": "Linear Mixed Model framework, LME, not including Weight",
      "attributes": {
        "femaleEffectSize": -2.26897436874991,
        "femaleKoEffectPValue": 0.0000158218813240424,
        "femaleKoEffectStderrEstimate": 1.4483780828355,
        "femaleKoParameterEstimate": -6.29899480128893,
        "femalePercentageChange": -147.078662616041,
        "maleKoEffectPValue": 1.64795021095271e-13,
        "maleKoEffectStderrEstimate": 1.64190026211007,
        "maleKoParameterEstimate": -12.36505744493,
        "malePercentageChange": -256.872587706567,
        "genotypeEffectPValue": 0.0000158218813239852,
        "genotypeEffectStderrEstimate": 1.4483780828355,
        "group1Genotype": "control",
        "group1ResidualsNormalityTest": 0.0014558534231195,
        "group2Genotype": "experimental",
        "group2ResidualsNormalityTest": 0.144759462554536,
        "interactionEffectPValue": 0.00562639936289155,
        "interactionSignificant": true,
        "interceptEstimate": 32.460313157981,
        "interceptEstimateStderrEstimate": 0.250943404199493,
        "maleEffectSize": -4.01896977446764,
        "sexEffectPValue": 0,
        "sexEffectParameterEstimate": 6.27323240671175,
        "sexEffectStderrEstimate": 0.243558733793172,
        "batchSignificant": true,
        "varianceSignificant": true
      }
    },
    "datasetId": "8b6a95e247700a808f592b43a6cfdfcf",
    "status": "Successful",
    "strainAccessionId": "MGI:2159965",
    "strainName": "C57BL/6N",
    "summaryStatistics": {
      "bothMutantCount": null,
      "bothMutantMean": null,
      "bothMutantSd": null,
      "femaleControlCount": 613,
      "femaleControlMean": 32.515660685155,
      "femaleControlSd": 3.31076419742509,
      "femaleMutantCount": 5,
      "femaleMutantMean": 25.64,
      "femaleMutantSd": 3.70580625505436,
      "maleControlCount": 644,
      "maleControlMean": 38.5026397515528,
      "maleControlSd": 3.32183630577072,
      "maleMutantCount": 4,
      "maleMutantMean": 25.8,
      "maleMutantSd": 1.56843871413581
    },
    "topLevelPhenotypes": [
      {
        "name": "growth/size/body region phenotype",
        "id": "MP:0005378"
      }
    ]
  }
];
describe('Data comparison component', () => {

  it('renders deduplicated data', async () => {
    render(<DataComparison data={datasets} />);
    const rows = await screen.findAllByRole('row');
    // 6 because includes the header ones
    expect(rows.length).toEqual(6);
    const headers = await screen.findAllByRole('columnheader');
    expect(headers.length).toEqual(11);
  });

  it('automatically selects the first row if not provided from props', async () => {
    const selectParamMock = jest.fn();
    render(<DataComparison data={datasets} onSelectParam={selectParamMock} selectedKey={""} />);
    await waitFor(() => {
      expect(selectParamMock).toHaveBeenCalled();
    });
  });

  it('emits the key of the row if the users clicks on it', async () => {
    const user = userEvent.setup();
    const selectParamMock = jest.fn();
    render(<DataComparison data={datasets} onSelectParam={selectParamMock} selectedKey={""} />);
    const rows = await screen.findAllByRole('row');
    // first 2 are the header ones
    await user.click(rows[4]);
    await waitFor(() => {
      expect(selectParamMock).toHaveBeenCalledTimes(2);
      expect(selectParamMock).toHaveBeenLastCalledWith(
        "MP:0001262-MGI:4363390-M-G-P_020_001_001-homozygote-WTSI-EPD0211_3_A05-Early adult-not_considered"
      );
    });
  });
});