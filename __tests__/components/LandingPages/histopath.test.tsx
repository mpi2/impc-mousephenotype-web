import { render } from '@testing-library/react';
import HistopathLandingPage from "@/pages/histopath";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Histopathology landing page', () => {
  it('renders correctly', () => {
    const { container } = render(
      <HistopathLandingPage />
    );
    expect(container).toMatchSnapshot();
  });
});