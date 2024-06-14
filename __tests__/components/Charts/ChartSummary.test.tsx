import { render, screen } from '@testing-library/react';
import ChartSummary from "@/components/Data/ChartSummary/ChartSummary";
import { Dataset } from "@/models";
import userEvent from "@testing-library/user-event";

const datasetSummary: Dataset = {
  "id": "66617d66820fc2a6e99d04c9",
  "alleleAccessionId": "MGI:6342258",
  "alleleName": "endonuclease-mediated mutation 1, Jackson",
  "alleleSymbol": "Otog<em1(IMPC)J>",
  "colonyId": "JR34077",
  "dataType": "categorical",
  "geneSymbol": "Otog",
  "geneticBackground": "involves: C57BL/6NJ",
  "intermediatePhenotypes": [{ id: "MP:0010678", name: "abnormal skin adnexa morphology" }],
  "lifeStageAcc": "IMPCLS:0005",
  "lifeStageName": "Early adult",
  "metadataGroup": "ba6c7cda9f0d4ce7d9a676c2aef86e22",
  "metadataValues": [
    "Experimenter ID = 136|Location of test = Open bench|Number of animals in cage = 3|Size of squares in arena = 68.89",
    "Experimenter ID = 136|Location of test = Open bench|Number of animals in cage = 5|Size of squares in arena = 68.89"
  ],
  "mgiGeneAccessionId": "MGI:1202064",
  "parameterName": "Vibrissae - appearance",
  "parameterStableId": "IMPC_CSD_024_001",
  "parameterStableKey": 1804,
  "phenotypeSex": ["male", "female"],
  "phenotypingCentre": "JAX",
  "pipelineName": "JAX Pipeline",
  "pipelineStableId": "JAX_001",
  "pipelineStableKey": 12,
  "procedureGroup": "IMPC_CSD",
  "procedureName": "Combined SHIRPA and Dysmorphology",
  "procedureStableId": "IMPC_CSD_001",
  "procedureStableKey": 82,
  "productionCentre": "JAX",
  "projectName": "JAX",
  "reportedEffectSize": 0.370222929936306,
  "reportedPValue": 0.0000121024575839839,
  "resourceFullName": "IMPC",
  "resourceName": "IMPC",
  "sex": "female",
  "zygosity": "homozygote",
  "significant": true,
  "significantPhenotype": {
    "name": "abnormal vibrissa morphology",
    "id": "MP:0002098"
  },
  "statisticalMethod": {
    "method": "Fisher Exact Test framework",
    "attributes": {
      "femaleEffectSize": null,
      "femaleKoEffectPValue": 0.0000106734229163214,
      "femaleKoEffectStderrEstimate": null,
      "femaleKoParameterEstimate": null,
      "femalePercentageChange": null,
      "maleKoEffectPValue": 1,
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
  "datasetId": "5a124934293cf296449781e17558d227",
  "status": "Successful",
  "strainAccessionId": "MGI:3056279",
  "strainName": "C57BL/6NJ",
  "summaryStatistics": {
    "bothMutantCount": null,
    "bothMutantMean": null,
    "bothMutantSd": null,
    "femaleControlCount": 1884,
    "femaleControlMean": null,
    "femaleControlSd": null,
    "femaleMutantCount": 5,
    "femaleMutantMean": null,
    "femaleMutantSd": null,
    "maleControlCount": 1884,
    "maleControlMean": null,
    "maleControlSd": null,
    "maleMutantCount": 3,
    "maleMutantMean": null,
    "maleMutantSd": null
  },
  "topLevelPhenotypes": [
    {
      "name": "integument phenotype",
      "id": "MP:0010771"
    }
  ]
}


describe('Chart summary component', () => {
  it('renders correctly', () => {
    const {container} = render(
      <ChartSummary
        datasetSummary={datasetSummary}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('display metadata model on link click', async () => {
    const user = userEvent.setup();
    render(<ChartSummary datasetSummary={datasetSummary} />);
    await user.click(await screen.findByText(/Lab conditions and equipment/i));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await user.click(await screen.findByRole("button"));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});