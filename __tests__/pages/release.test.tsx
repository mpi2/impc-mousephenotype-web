import { screen } from '@testing-library/react';
import ReleasePage from "@/pages/release";
import { renderWithClient } from "../utils";
import { waitFor } from "@testing-library/react";
import releaseData from '../../mocks/data/tests/release-data.json';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

jest.mock("react-markdown", () => (props) => {
  return <>{props.children}</>
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Allele page', () => {
  it('renders correctly', async () => {

    const { container } = renderWithClient(
      <ReleasePage releaseMetadata={releaseData} />
    );
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("IMPC Data Release 21.0 Notes"));
    expect(container).toMatchSnapshot();
  });
});