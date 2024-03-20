import { render, screen } from '@testing-library/react'
import { NumberCell } from "@/components/SmartTable";

describe('Number cell component', () => {
  it('renders correctly and formats the number', () => {
    const data = { field: 2000 };
    render(<NumberCell value={data} field="field" />);
    expect(screen.queryByText('2,000')).toBeInTheDocument();
  });
});