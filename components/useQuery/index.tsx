import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export default ({
  query,
  afterSuccess,
}: {
  query: string;
  afterSuccess?: (data?: any) => void;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const controllerRef = useRef() as any;
  const cache = useRef<Object>({});

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
        if (cache.current[query]) {
          setData(cache.current[query]);
          if (!!afterSuccess) afterSuccess(cache.current[query]);
        } else {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_ROOT ?? ""}${query}`,
            { signal: controllerRef.current.signal }
          );
          console.log("useQuery", query, res);
          if (res.ok) {
            const data = await res.json();
            setData(data);
            cache.current[query] = data;
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
