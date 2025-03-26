import { render } from "@testing-library/react";
import Newsletter from "@/components/Newsletter";

describe("Newsletter component", () => {
  it("renders correctly", () => {
    const { container } = render(<Newsletter />);
    expect(container).toMatchSnapshot();
  });
});
