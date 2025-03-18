import { screen, render } from "@testing-library/react";
import FilterBox from "@/components/FilterBox/FilterBox";
import userEvent from "@testing-library/user-event";

describe("FilterBox component", () => {
  it("behaves like a text input if no options are provided", async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();
    render(
      <FilterBox controlId="test" ariaLabel="test" onChange={onChangeMock} />,
    );
    const textBox = await screen.findByRole("textbox");
    expect(textBox).toHaveAttribute("placeholder", "Search");
    await user.type(textBox, "ABNORMAL");
    expect(onChangeMock).toHaveBeenCalledWith("abnormal");
    await user.clear(textBox);
    expect(onChangeMock).toHaveBeenCalledWith(undefined);
  });

  it("behaves like a select if options are provided", async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();
    const selectedValue = "OPTION 1";
    render(
      <FilterBox
        controlId="test"
        ariaLabel="test"
        value={selectedValue}
        onChange={onChangeMock}
        options={["OPTION 1", "OPTION 2", "OPTION 3"]}
      />,
    );
    const comboBox = await screen.findByRole("combobox");
    expect(comboBox).toHaveValue("OPTION 1");
    await user.selectOptions(comboBox, ["OPTION 3"]);
    expect(onChangeMock).toHaveBeenCalledWith("OPTION 3");
    await user.selectOptions(comboBox, ["all"]);
    expect(onChangeMock).toHaveBeenCalledWith(undefined);
  });

  it("should not render anything if only has one option", async () => {
    const onChangeMock = jest.fn();
    render(
      <FilterBox
        controlId="test"
        ariaLabel="test"
        onChange={onChangeMock}
        options={["OPTION 1"]}
      />,
    );
    expect(screen.queryByTestId("filterbox-test")).not.toBeInTheDocument();
  });

  it("should display the options alphabetically", async () => {
    const onChangeMock = jest.fn();
    render(
      <FilterBox
        controlId="test"
        ariaLabel="test"
        onChange={onChangeMock}
        options={["Z", "A", "C", "F", "B"]}
      />,
    );
    const options = await screen.findAllByRole("option");
    const optionsText = options.map((opt) => opt.textContent);
    expect(optionsText).toEqual(["All", "A", "B", "C", "F", "Z"]);
  });
});
