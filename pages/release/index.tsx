import { fetchLandingPageData } from "@/api-service";
import ReleaseNotesPage from "./release";
import { ReleaseMetadata } from "@/models/release";

type Props = {
  releaseMetadata: ReleaseMetadata;
};

const ReleasePage = (props: Props) => {
  return <ReleaseNotesPage releaseMetadata={props.releaseMetadata} />;
};

export async function getServerSideProps() {
  const data = await fetchLandingPageData("release_metadata");
  return {
    props: { releaseMetadata: data },
  };
}

export default ReleasePage;
