import { PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.scss";
import Link from "next/link";
import parse from "html-react-parser";

type Props = {
  containerId: string;
  title: string;
  href?: string;
};

const SectionHeader = (props: PropsWithChildren<Props>) => {
  const { href } = props;

  return (
    <>
      <div className={styles.titleWrapper}>
        <h2>{parse(props.title)}</h2>
        {!!href && (
          <Link
            href={href}
            className="btn"
            aria-label={`${props.title} documentation`}
          >
            <FontAwesomeIcon icon={faCircleQuestion} size="xl" />
          </Link>
        )}
      </div>
    </>
  );
};

export default SectionHeader;
