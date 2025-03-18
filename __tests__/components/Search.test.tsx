import { screen, render, fireEvent } from "@testing-library/react";
import Search from "@/components/Search";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { AppRouterContextProviderMock } from "../utils";

jest.mock("next/navigation", () => {
  const originalModule = jest.requireActual("next/navigation");
  const { useRouter } = jest.requireActual("next-router-mock");
  const usePathname = jest.fn().mockImplementation(() => {
    const router = useRouter();
    return router.pathname;
  });
  return {
    __esModule: true,
    ...originalModule,
    useRouter: jest.fn().mockImplementation(useRouter),
    useSearchParams: jest.fn().mockImplementation(() => new URLSearchParams()),
    usePathname,
  };
});

describe("Search component", () => {
  it("should have Genes tab active by default", () => {
    mockRouter.push("/");
    render(
      <AppRouterContextProviderMock>
        <Search />
      </AppRouterContextProviderMock>,
    );
    const geneLinkTab = screen.getByText(/Genes/i);
    expect(geneLinkTab).toHaveClass("tab__active");
  });

  it("should have Phenotypes tab active if has default type prop as ", () => {
    mockRouter.push("/phenotypes?type=pheno");
    render(
      <AppRouterContextProviderMock>
        <Search defaultType="phenotype" />
      </AppRouterContextProviderMock>,
    );
    const phenotypeLinkTab = screen.getByText(/Phenotypes/i);
    expect(phenotypeLinkTab).toHaveClass("tab__active");
  });

  it("should execute onChange function on search button click", async () => {
    mockRouter.push("/");
    const onChangeMockFn = jest.fn();
    render(
      <AppRouterContextProviderMock>
        <Search onChange={onChangeMockFn} />
      </AppRouterContextProviderMock>,
    );
    await userEvent.type(screen.getByRole("textbox"), "Cib2");
    fireEvent.click(screen.getByRole("button"));
    expect(onChangeMockFn).toHaveBeenCalledTimes(1);
    expect(onChangeMockFn).toHaveBeenCalledWith("Cib2");
  });

  it("should update url query on Enter", () => {
    mockRouter.push("/phenotypes?type=pheno");
    render(
      <AppRouterContextProviderMock>
        <Search />
      </AppRouterContextProviderMock>,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Cib2" },
    });
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      charCode: 13,
    });
    expect(mockRouter).toMatchObject({
      asPath: "/search?term=Cib2",
      query: { term: "Cib2" },
    });
  });

  it("should preserve query params after searching", () => {
    mockRouter.push("/data/phenotypes/MP:0002144");
    render(
      <AppRouterContextProviderMock>
        <Search defaultType="phenotype" />
      </AppRouterContextProviderMock>,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Cib2" },
    });
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      charCode: 13,
    });
    expect(mockRouter).toMatchObject({
      asPath: "/search?term=Cib2&type=pheno",
      query: { term: "Cib2", type: "pheno" },
    });
    const phenotypeLinkTab = screen.getByText(/Phenotypes/i);
    expect(phenotypeLinkTab).toHaveClass("tab__active");
  });
});
