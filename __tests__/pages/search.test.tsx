import SearchResults from "@/pages/search";
import { screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import { renderWithClient } from "../utils";
import { GeneComparatorProvider } from "@/components/GeneComparator";
import mockRouter from 'next-router-mock';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Search Results', () => {
  it('renders default title', () => {
    renderWithClient(
      <GeneComparatorProvider>
        <SearchResults />
      </GeneComparatorProvider>
    );
    const heading = screen.getByRole('heading', {
        name: /Gene search results/i,
    });
    expect(heading).toBeInTheDocument();
  });
  it('renders phenotype title based on query', () => {
    mockRouter.push('/search?type=phenotype');
    renderWithClient(
      <GeneComparatorProvider>
        <SearchResults />
      </GeneComparatorProvider>
    );
    const heading = screen.getByRole('heading', {
      name: /Phenotype search results/i,
    });
    expect(heading).toBeInTheDocument();
  })
});
