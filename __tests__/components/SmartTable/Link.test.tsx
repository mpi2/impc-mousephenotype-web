import { render, screen } from '@testing-library/react'
import { LinkCell } from "@/components/SmartTable";

describe('Link cell component', () => {
  it('renders a link correctly', () => {
    const data = { mgiGeneAccessionId: 'MGI:000000' };
    render(<LinkCell value={data} field="mgiGeneAccessionId" prefix="/genes" />);
    const link = screen.queryByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/genes/MGI:000000');
  });

  it('if is provided with altFieldForURL prop, will use that field to build the url', () => {
    const data = { mgiGeneAccessionId: 'MGI:000000', anatomy: 'spleen' };
    render(<LinkCell value={data} field="mgiGeneAccessionId" prefix="/histopathology" altFieldForURL="anatomy" />);
    const link = screen.queryByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/histopathology/spleen');
  });
});