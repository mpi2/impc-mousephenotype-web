import IDGPage from "@/pages/secondary-projects/idg";
import { renderWithClient } from "../utils";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('IDG page', () => {
  it('renders correctly', async () => {
    const { container } = renderWithClient(
      <IDGPage />
    );
    expect(container).toMatchSnapshot();
  });
});