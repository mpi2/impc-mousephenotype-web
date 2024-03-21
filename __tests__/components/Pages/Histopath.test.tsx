import { screen, waitFor } from '@testing-library/react';
import mockRouter from "next-router-mock";
import Histopath from "@/pages/data/histopath/[pid]";
import { server } from "../../../mocks/server";
import { API_URL, renderWithClient } from "../../utils";
import { rest } from "msw";
import ascc2Data from '../../../mocks/data/genes/MGI:1922702/histopath.json';
import ascc2SummaryData from '../../../mocks/data/genes/MGI:1922702/summary.json';
import userEvent from "@testing-library/user-event";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Histopath page', () => {

  it('provides generic functionality of a normal table', async () => {
    const user = userEvent.setup();
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1922702/summary`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(ascc2SummaryData));
      })
    );
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1922702/histopathology`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(ascc2Data));
      })
    );
    await mockRouter.push('/data/histopath/MGI:1922702?pid=MGI:1922702');
    renderWithClient(<Histopath />);
    await waitFor(() =>
      expect(screen.getByTestId('main-header')).toHaveTextContent('Histopathology data for Ascc2')
    );

    await waitFor(async () => {
      const rows = await screen.findAllByRole('row');
      return expect(rows.length).toEqual(11);
    });
    expect(await screen.findByTestId('top-last-page-btn')).toHaveTextContent('14');
    const searchBox = screen.getByRole('textbox', { name: 'Filter by parameters' });
    await user.type(searchBox, 'Brain');
    let rows = await screen.findAllByRole('row');
    return expect(rows.length).toEqual(5);
  });

  it('should filter by anatomy term if is specified in a query param', async () => {
    const user = userEvent.setup();
    const replaceSpy = jest.spyOn(mockRouter, 'replace');
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1922702/summary`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(ascc2SummaryData));
      })
    );
    server.use(
      rest.get(`${API_URL}/api/v1/genes/MGI:1922702/histopathology`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(ascc2Data));
      })
    );
    await mockRouter.push('/data/histopath/MGI:1922702?pid=MGI:1922702&anatomy=heart');
    renderWithClient(<Histopath />);
    await waitFor(() =>
      expect(screen.getByTestId('main-header')).toHaveTextContent('Histopathology data for Ascc2')
    );
    await waitFor(async () => {
      const rows = await screen.findAllByRole('row');
      return expect(rows.length).toEqual(5);
    });
    expect(screen.getByTestId('anatomy-badge')).toBeInTheDocument();
    await user.click(screen.getByTestId('anatomy-badge'));
    expect(replaceSpy).toBeCalled();
  });
});