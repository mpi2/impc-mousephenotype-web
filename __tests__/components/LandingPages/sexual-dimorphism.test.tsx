import renderer from 'react-test-renderer';
import SexualDimorphismLandingPage from "@/pages/sexual-dimorphism";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { API_URL } from "../../utils";

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Sexual dimorphism landing page', () => {
  it('renders correctly', () => {
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
      <SexualDimorphismLandingPage />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});