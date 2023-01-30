import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      setLoading(true);
      try {
        if (!query) throw new Error("API url not found");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ROOT ?? ""}${query}`
        );
        if (res.ok) {
          const data = await res.json();
          setData(data);
          if (!!afterSuccess) afterSuccess(data);
        } else {
          throw new Error("Could not fetch the resource.");
        }
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    })();
  }, [router.isReady, query]);

  return [data, loading, error];
};
