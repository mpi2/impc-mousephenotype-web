import { ReleaseMetadata } from "@/models/release";
import ReleaseNotesPage from "../../../components/ReleasePage/release";
import { fetchLandingPageData, fetchReleaseNotesData } from "@/api-service";

type Props = {
  releaseMetadata: ReleaseMetadata;
};

const PreviousReleasePage = (props: Props) => {
  return <ReleaseNotesPage releaseMetadata={props.releaseMetadata} />;
};

export async function getServerSideProps(context) {
  const { tag } = context.params;
  const data = await fetchReleaseNotesData(tag);
  return {
    props: { releaseMetadata: data },
  };
}

export default PreviousReleasePage;
