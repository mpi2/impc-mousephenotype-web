import { screen, render, fireEvent } from '@testing-library/react';
import Search from "@/components/Search";
import mockRouter from "next-router-mock";
import userEvent from "@testing-library/user-event";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Search component', () => {
  it('should have Genes tab active by default', () => {
    render(<Search />);
    const geneLinkTab = screen.getByText(/Genes/i);
    expect(geneLinkTab).toHaveClass('tab__active');
  });

  it('should have Phenotypes tab active if has default type prop as ', () => {
    mockRouter.push('phenotypes/MP:0002127');
    render(<Search defaultType="phenotype" />);
    const phenotypeLinkTab = screen.getByText(/Phenotypes/i);
    expect(phenotypeLinkTab).toHaveClass('tab__active');
  });

  it('should execute onChange function on search button click', async () => {
    const onChangeMockFn = jest.fn();
    render(<Search onChange={onChangeMockFn} />);
    await userEvent.type(screen.getByRole('textbox'), "Cib2");
    fireEvent.click(screen.getByRole('button'));
    expect(onChangeMockFn).toHaveBeenCalledTimes(1);
    expect(onChangeMockFn).toHaveBeenCalledWith('Cib2');
  });

  it('should update url query on Enter', () => {
    mockRouter.push('/phenotypes/MP:0002127');
    render(<Search/>);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Cib2' } });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', charCode: 13 });
    expect(mockRouter).toMatchObject({
      asPath: '/search?query=Cib2',
      query: { query: 'Cib2' }
    });
  });

  it('should preserve query params after searching', () => {
    mockRouter.push('/search?type=phenotype');
    render(<Search />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Cib2' } });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', charCode: 13 });
    expect(mockRouter).toMatchObject({
      asPath: '/search?type=phenotype&query=Cib2',
      query: { query: 'Cib2', type: 'phenotype' }
    });
    const phenotypeLinkTab = screen.getByText(/Phenotypes/i);
    expect(phenotypeLinkTab).toHaveClass('tab__active');
  });

});