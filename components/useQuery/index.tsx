import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fetchCache } from "../../utils";

export default function<T> ({
  query,
  afterSuccess,
}: {
  query: string;
  afterSuccess?: (data?: T) => void;
}): [T, boolean, string] {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>(null);
  const [error, setError] = useState<null | string>(null);
  const controllerRef = useRef() as any;

  useEffect(() => {
    if (!router.isReady) return;
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();

    (async () => {
      setLoading(true);
      try {
        if (!query) throw new Error("API url not found");
        if (fetchCache[query]) {
          setData(fetchCache[query]);
          if (!!afterSuccess) afterSuccess(fetchCache[query]);
        } else {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_ROOT ?? ""}${query}`,
            { signal: controllerRef.current.signal }
          );
          if (res.ok) {
            const data = await res.json();
            setData(data);
            fetchCache[query] = data;
            if (!!afterSuccess) afterSuccess(data);
          } else {
            throw new Error("Could not fetch the resource.");
          }
        }
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    })();
  }, [router.isReady, query]);

  return [data, loading, error];
};
