import { render, screen } from '@testing-library/react';
import EmbryoVignettesPage from "@/pages/embryo/vignettes";
import userEvent from "@testing-library/user-event";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Embryo Vignettes page', () => {
  it('renders correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EmbryoVignettesPage />
    );
    expect(container).toMatchSnapshot();
    for(let i = 0; i < 19; i++) {
      await user.click(screen.getByRole('button', { name: "Next" }));
    }
  });
});