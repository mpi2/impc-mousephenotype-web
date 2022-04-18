import _ from "lodash";

export const formatBodySystems = (systems: string[] | string = []) => {
  return _.capitalize(
    (typeof systems === "string" ? systems : systems.join(", "))
      .replace(/ phenotype/g, "")
      .replace(/\//g, " / ")
  );
};
