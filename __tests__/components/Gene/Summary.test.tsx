import { screen } from '@testing-library/react';
import GeneSummary from '@/components/Gene/Summary';
import { renderWithClient } from "../../utils";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

let gene = {
  geneName: "calcium and integrin binding family member 2",
  geneSymbol: "Cib2",
  mgiGeneAccessionId: "MGI:1929293",
  synonyms: ["calcium binding protein Kip2", "2810434I23Rik"],
  significantPhenotypesCount: 25,
  notSignificantTopLevelPhenotypes: [
    "reproductive system phenotype",
    "integument phenotype",
    "adipose tissue phenotype",
    "growth/size/body region phenotype",
    "muscle phenotype",
    "cardiovascular system phenotype",
    "craniofacial phenotype",
    "renal/urinary system phenotype",
    "pigmentation phenotype",
    "limbs/digits/tail phenotype",
    "vision/eye phenotype",
    "skeleton phenotype",
    "mortality/aging"
  ],
  significantTopLevelPhenotypes: [
    "homeostasis/metabolism phenotype",
    "immune system phenotype",
    "hearing/vestibular/ear phenotype",
    "nervous system phenotype",
    "hematopoietic system phenotype",
    "behavior/neurological phenotype"
  ],
  hasLacZData: true,
  hasImagingData: true,
  hasViabilityData: true,
  hasBodyWeightData: true,
  hasEmbryoImagingData: false,
};

describe('Gene summary component', () => {
  it('displays physiological systems correctly', async () => {
    renderWithClient(<GeneSummary gene={gene} error={''} loading={false} />);
    expect(screen.getByTestId('totalCount')).toHaveTextContent('19 /24 physiological systems tested');
    expect(screen.getByTestId('significantSystemIcons').children).toHaveLength(6);
    expect(screen.getByTestId('significantCount')).toHaveTextContent('6')
    expect(screen.getByTestId('notSignificantSystemIcons').children).toHaveLength(13);
    expect(screen.getByTestId('nonSignificantCount')).toHaveTextContent('13')
    expect(screen.getByTestId('notTestedSystemIcons').children).toHaveLength(5);
    expect(screen.getByTestId('nonTestedCount')).toHaveTextContent('5')
  });

  it('displays data collection status correctly',() => {
    renderWithClient(<GeneSummary gene={gene} error={''} loading={false} />);
    expect(screen.getByTestId('LacZ expression')).not.toHaveClass('dataCollectionInactive');
    expect(screen.getByTestId('Histopathology')).toHaveClass('dataCollectionInactive');
    expect(screen.getByTestId('Images')).not.toHaveClass('dataCollectionInactive');
    expect(screen.getByTestId('Body weight measurements')).not.toHaveClass('dataCollectionInactive');
    expect(screen.getByTestId('Viability data')).not.toHaveClass('dataCollectionInactive');
    expect(screen.getByTestId('Embryo imaging data')).toHaveClass('dataCollectionInactive');
  });

  it('should have synonyms tooltip if have 3 or more', () => {
    renderWithClient(
      <GeneSummary gene={{...gene, synonyms: ['1', '2', '3', '4']}} error={''} loading={false} />
    );
    expect(screen.getByTestId('synonyms')).toBeDefined();
  });

});