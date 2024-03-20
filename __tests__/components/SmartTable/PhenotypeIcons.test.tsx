import { render, screen } from '@testing-library/react'
import { PhenotypeIconsCell } from "@/components/SmartTable";

describe('Phenotypes icons cell component', () => {
  it('renders the icons correctly', async () => {
    const data = { topLevelPhenotypes: ['vision/eye phenotype', 'cardiovascular system phenotype'] };
    render(<PhenotypeIconsCell value={data} allPhenotypesField="topLevelPhenotypes" />);
    const icons = await screen.findAllByTestId('body-icon');
    expect(icons.length).toEqual(2);
  });
  it('should not fail if the specified field is null', async () => {
    const data = { topLevelPhenotypes: null };
    render(<PhenotypeIconsCell value={data} allPhenotypesField="topLevelPhenotypes" />);
    const icons = screen.queryAllByTestId('body-icon');
    expect(icons.length).toEqual(0);
  });
});