import LateAdultPage from "@/pages/late-adult-data";
import { renderWithClient } from "../utils";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Late Adult page', () => {
  it('renders correctly', async () => {
    const { container } = renderWithClient(
      <LateAdultPage />
    );
    expect(container).toMatchSnapshot();
  });
});