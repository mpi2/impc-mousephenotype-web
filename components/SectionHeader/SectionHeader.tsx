import React, { PropsWithChildren, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "react-bootstrap";

type Props = {
  containerId: string;
  title: string;
};

const SectionHeader = (props: PropsWithChildren<Props>) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <div className={styles.titleWrapper}>
        <h2>{props.title}</h2>
        <button
          className="btn"
          onClick={() => setIsVisible(prevState => !prevState)}
          aria-label="Open help overlay"
        >
          <FontAwesomeIcon icon={faCircleQuestion} size="xl"/>
        </button>
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={classNames(styles.overlay)}
            layout
            transition={{ type: "tween", duration: 0.3}}
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
          >
            <h2>{props.title} section help</h2>
            <Container>
              {props.children}
            </Container>
            <div className={styles.closeBtn}>
              <button className="btn" onClick={() => setIsVisible(false)}>
                <FontAwesomeIcon icon={faXmark} size="xl"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
};

export default SectionHeader;