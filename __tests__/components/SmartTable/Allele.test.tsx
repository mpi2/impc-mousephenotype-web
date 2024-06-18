import { render } from '@testing-library/react';
import { AlleleCell } from "@/components/SmartTable";

describe('Allele cell component', () => {
  it('renders correctly', () => {
    const data = { allele: 'Nxn<em1(IMPC)Mbp>' };
    const { container } = render(<AlleleCell value={data} field="allele" />);
    expect(container).toMatchSnapshot();
  });
});