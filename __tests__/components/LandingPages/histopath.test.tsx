import renderer from 'react-test-renderer';
import HistopathLandingPage from "@/pages/histopath";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Histopathology landing page', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <HistopathLandingPage />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});