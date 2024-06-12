import renderer from 'react-test-renderer';
import EmbryoLandingPage from "@/pages/embryo";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { API_URL, createTestQueryClient } from "../../utils";
import { QueryClientProvider } from "@tanstack/react-query";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Embryo landing page', () => {
  it('renders correctly', () => {
    const client = createTestQueryClient();
    server.use(
      rest.get(`${API_URL}/api/v1/publications`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
          content: [],
          first: true,
          last: false,
          number: 0,
          numberOfElements: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
        }));
      })
    );
    const tree = renderer.create(
      <QueryClientProvider client={client}>
        <EmbryoLandingPage />
      </QueryClientProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});