import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type EnabledFlags = {
  isNNumbersFootnoteAvailable: boolean;
};

type Flag = {
  name: string;
  propName: keyof EnabledFlags;
  queryParamName: string;
  valueToEnable: string;
};

const listOfFlags: Array<Flag> = [
  {
    name: "N-numbers footnote",
    propName: "isNNumbersFootnoteAvailable",
    queryParamName: "nnumbersfootnote",
    valueToEnable: "enabled",
  },
];

export const useQueryFlags = () => {
  const router = useRouter();

  const [flags, setFlags] = useState<EnabledFlags>({
    isNNumbersFootnoteAvailable: false,
  });
  useEffect(() => {
    const params = router.query;
    for (const [key, value] of Object.entries(params)) {
      const flag = listOfFlags.find((flag) => flag.queryParamName === key);
      if (flag) {
        const shouldBeEnabled = flag.valueToEnable === value;
        setFlags((prevFlags) => {
          return {
            ...prevFlags,
            [flag.propName]: shouldBeEnabled,
          };
        });
      }
    }
  }, [router.query]);
  return flags;
};
