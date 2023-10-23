import Pagination from "@/components/Pagination";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe('Pagination component', () => {
  it('behaves correctly when is uncontrolled', async () => {
    const user = userEvent.setup();
    const data = Array.from({ length: 30 }, (_, i) => i);
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
    expect(screen.queryByTestId('top-page-4')).not.toBeInTheDocument();
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
    expect(screen.getByTestId('top-next-page')).toBeDisabled();
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
  })
});