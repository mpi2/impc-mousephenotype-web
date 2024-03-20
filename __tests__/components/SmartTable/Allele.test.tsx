import renderer from 'react-test-renderer';
import { AlleleCell } from "@/components/SmartTable";


describe('Allele cell component', () => {
  it('renders correctly', () => {
    const data = { allele: 'Nxn<em1(IMPC)Mbp>' };
    const tree = renderer.create(<AlleleCell value={data} field="allele" />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});