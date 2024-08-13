import { render, screen } from '@testing-library/react';
import EmbryoVignettesPage from "@/pages/embryo/vignettes";
import userEvent from "@testing-library/user-event";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

jest.mock("react-slick", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="slick_mock">{children}</div>,
}));

describe('Embryo Vignettes page', () => {
  it('renders correctly', async () => {
    const { container } = render(
      <EmbryoVignettesPage />
    );
    expect(container).toMatchSnapshot();
  });
});