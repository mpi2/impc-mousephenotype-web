import type { NextApiRequest, NextApiResponse } from "next";

const BATCH_QUERY_DOWNLOAD_ROOT =
  process.env.NEXT_PUBLIC_BATCH_QUERY_DOWNLOAD_ROOT || "";

const stringifyJSON = (data: Array<any>) => {
  let res = "[";
  data.forEach((item) => {
    console.log(item);
    res += `${JSON.stringify(item)},`;
  });
  res += "]";
  return res;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let response;
    try {
      response = await fetch(BATCH_QUERY_DOWNLOAD_ROOT, {
        method: "POST",
        body: req.body,
        headers: {
          "Content-type": req.headers["content-type"],
          Accept: "*/*",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
    if (!response.ok) {
      res.status(500).json({ error: response.statusText });
    }
    let resultText = "";
    const jsonData = [];
    const readableStream = response.body;
    const reader = readableStream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      var text = new TextDecoder("utf-8").decode(value);
      const objects = text.split("\n");
      for (const obj of objects) {
        try {
          resultText += obj;
          jsonData.push(JSON.parse(resultText));
          resultText = "";
        } catch (e) {
          // Not a valid JSON object
        }
      }
    }
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=batch-query-results.json`
    );
    res.write(stringifyJSON(jsonData));
    res.end();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
