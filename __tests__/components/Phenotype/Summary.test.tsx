import { screen, render } from '@testing-library/react';
import PhenotypeSummary from '@/components/Phenotype/Summary';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

let phenotype = {
  notSignificantGenes: 8044,
  phenotypeDefinition: "any structural anomaly of the heart or vascular tissue",
  phenotypeId: "MP:0002127",
  phenotypeName: "abnormal cardiovascular system morphology",
  phenotypeSynonyms: ["cardiovascular dysplasia", "cardiovascular system dysplasia", "heart/cardiovascular system: dysmorphology"],
  significantGenes: 1247,
  topLevelPhenotypes: [{id: null, name: "cardiovascular system phenotype"}]
}

describe('Phenotype Summary component', () => {
  it('calculates and displays gene count information', () => {
    render(<PhenotypeSummary phenotype={phenotype} isError={false} isLoading={false} />);
    expect(screen.getByTestId('significant-genes')).toHaveTextContent('1247significant genes');
    expect(screen.getByTestId('tested-genes-percentage')).toHaveTextContent('13.42%of tested genes');
    expect(screen.getByTestId('total-genes-tested')).toHaveTextContent('9291tested genes');
  });

  it('should have synonyms tooltip if have 3 or more', () => {
    render(<PhenotypeSummary phenotype={phenotype} isError={false} isLoading={false} />);
    expect(screen.getByTestId('synonyms')).toBeDefined();
  });
})