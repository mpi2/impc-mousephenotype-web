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
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 1 /3');
    expect(screen.getByTestId('prev-page')).toBeDisabled();
    expect(screen.getByTestId('next-page')).toBeEnabled();
    await user.click(screen.getByTestId('next-page'));

    items = await screen.findAllByText(/Item #[0-9]+/);
    expect(items).toHaveLength(10);
    expect(screen.getByTestId('child-19')).toBeDefined();
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 2 /3');
    expect(screen.getByTestId('prev-page')).toBeEnabled();
    expect(screen.getByTestId('next-page')).toBeEnabled();
    await user.click(screen.getByTestId('next-page'));

    items = await screen.findAllByText(/Item #[0-9]+/);
    expect(items).toHaveLength(10);
    expect(screen.getByTestId('child-29')).toBeDefined();
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 3 /3');
    expect(screen.getByTestId('prev-page')).toBeEnabled();
    expect(screen.getByTestId('next-page')).toBeDisabled();
    await user.click(screen.getByTestId('prev-page'));
    expect(screen.getByTestId('child-19')).toBeDefined();
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 2 /3');

    await user.selectOptions(screen.getByRole('combobox'), ['30']);
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 1 /1');
    items = await screen.findAllByText(/Item #[0-9]+/)
    expect(items).toHaveLength(30);

    await user.selectOptions(screen.getByRole('combobox'), ['10']);
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 1 /3');
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
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 1 /3');

    await user.click(screen.getByTestId('next-page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 2 /3');

    await user.click(screen.getByTestId('next-page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 3 /3');

    await user.click(screen.getByTestId('prev-page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 2 /3');

    await user.selectOptions(screen.getByRole('combobox'), ['30']);
    expect(screen.getByTestId('current-page')).toHaveTextContent('Page 1 /1');
    expect(onPageSizeChange).toHaveBeenCalledWith(30);
  })
});