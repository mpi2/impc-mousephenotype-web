import Pagination from "@/components/Pagination";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe('Pagination component', () => {
  it('behaves correctly when is uncontrolled', async () => {
    const user = userEvent.setup();
    const data = Array.from({ length: 100 }, (_, i) => i);
    render(
      <div data-testid="pagination-wrapper">
        <Pagination data={data}>
          {(pageData) => pageData.map(data =>
            <span
              key={data}
              data-testid={`child-${data}`}
              className="child"
            >
              Item #{data}
            </span>
          )}
        </Pagination>
      </div>
    );
    let items = await screen.findAllByText(/Item #[0-9]+/);
    expect(items).toHaveLength(10);
    expect(screen.getByTestId('top-page-1')).toHaveClass('active');
    expect(screen.queryByTestId('top-page-7')).not.toBeInTheDocument();
    expect(screen.getByTestId('top-prev-page')).toBeDisabled();
    expect(screen.getByTestId('top-next-page')).toBeEnabled();
    await user.click(screen.getByTestId('top-next-page'));

    items = await screen.findAllByText(/Item #[0-9]+/);
    expect(items).toHaveLength(10);
    expect(screen.getByTestId('child-19')).toBeDefined();

    expect(screen.getByTestId('top-page-2')).toHaveClass('active');
    expect(screen.getByTestId('top-prev-page')).toBeEnabled();
    expect(screen.getByTestId('top-next-page')).toBeEnabled();
    await user.click(screen.getByTestId('top-next-page'));

    items = await screen.findAllByText(/Item #[0-9]+/);
    expect(items).toHaveLength(10);
    expect(screen.getByTestId('child-29')).toBeDefined();
    expect(screen.getByTestId('top-page-3')).toHaveClass('active');
    expect(screen.getByTestId('top-prev-page')).toBeEnabled();
    await user.click(screen.getByTestId('top-prev-page'));
    expect(screen.getByTestId('child-19')).toBeDefined();
    expect(screen.getByTestId('top-page-2')).toHaveClass('active');

    await user.selectOptions(screen.getByRole('combobox'), ['30']);
    expect(screen.getByTestId('top-page-1')).toHaveClass('active');
    items = await screen.findAllByText(/Item #[0-9]+/)
    expect(items).toHaveLength(30);

    await user.selectOptions(screen.getByRole('combobox'), ['10']);
    expect(screen.getByTestId('top-page-1')).toHaveClass('active');
    expect(screen.getByTestId('child-9')).toBeDefined();
    items = await screen.findAllByText(/Item #[0-9]+/)
    expect(items).toHaveLength(10);

    await user.click(screen.getByTestId('bottom-last-page-btn'));
    expect(screen.getByTestId('child-99')).toBeDefined();

    await user.click(screen.getByTestId('top-first-page-btn'));
    expect(screen.getByTestId('child-9')).toBeDefined();

    await user.click(screen.getByTestId('bottom-page-5-btn'));
    expect(screen.getByTestId('child-49')).toBeDefined();

    await user.click(screen.getByTestId('bottom-page-7-btn'));
    expect(screen.getByTestId('child-69')).toBeDefined();

    await user.click(screen.getByTestId('bottom-page-9-btn'));
    expect(screen.getByTestId('child-89')).toBeDefined();

    await user.click(screen.getByTestId('bottom-page-10-btn'));
    expect(screen.getByTestId('child-99')).toBeDefined();

  });

  it ('uses the props when it is controlled', async () => {
    const user = userEvent.setup();
    const data = Array.from({ length: 30 }, (_, i) => i);
    let page = 0;
    let pageSize = 10;
    const onPageChange = jest.fn((newValue: number) => page = newValue);
    const onPageSizeChange = jest.fn((newValue: number) => page = newValue);

    render(
      <div data-testid="pagination-wrapper">
        <Pagination
          data={data.slice(page, pageSize * (page + 1))}
          controlled
          page={page}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
          totalItems={data.length}
        >
          {(pageData) => pageData.map(data =>
            <span
              key={data}
              data-testid={`child-${data}`}
              className="child"
            >
              Item #{data}
            </span>
          )}
        </Pagination>
      </div>
    );

    let items = await screen.findAllByText(/Item #[0-9]+/);
    expect(items).toHaveLength(10);
    expect(screen.getByTestId('top-page-1')).toHaveClass('active');

    await user.click(screen.getByTestId('top-next-page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByTestId('top-page-2')).toHaveClass('active');

    await user.click(screen.getByTestId('top-next-page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByTestId('top-page-3')).toHaveClass('active');

    await user.click(screen.getByTestId('top-prev-page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByTestId('top-page-2')).toHaveClass('active');

    await user.selectOptions(screen.getByRole('combobox'), ['30']);
    expect(screen.getByTestId('top-page-1')).toHaveClass('active');
    expect(onPageSizeChange).toHaveBeenCalledWith(30);
  });

  it('only shows top nav buttons if specified', async () => {
    const data = Array.from({ length: 100 }, (_, i) => i);
    render(
      <div data-testid="pagination-wrapper">
        <Pagination data={data} buttonsPlacement="top">
          {(pageData) => pageData.map(data =>
            <span
              key={data}
              data-testid={`child-${data}`}
              className="child"
            >
              Item #{data}
            </span>
          )}
        </Pagination>
      </div>
    );
    expect(screen.queryByTestId('nav-buttons-top')).toBeInTheDocument();
    expect(screen.queryByTestId('nav-buttons-bottom')).not.toBeInTheDocument();
  });

  it('adds the additional controls class if was provided a value for the prop', async () => {
    const data = Array.from({ length: 30 }, (_, i) => i);
    render(
      <div data-testid="pagination-wrapper">
        <Pagination data={data} additionalTopControls={<span>Additional text</span>}>
          {(pageData) => pageData.map(data =>
            <span
              key={data}
              data-testid={`child-${data}`}
              className="child"
            >
              Item #{data}
            </span>
          )}
        </Pagination>
      </div>
    );
    expect(screen.queryByTestId('top-controls-wrapper')).toHaveClass('withControls');
  });
});