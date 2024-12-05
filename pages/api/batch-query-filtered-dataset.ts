import prettyBytes from "@/utils/pretty-bytes";
import type { NextApiRequest, NextApiResponse } from "next";
const { Buffer } = require("node:buffer");
const archiver = require("archiver");

const BATCH_QUERY_DOWNLOAD_ROOT =
  process.env.NEXT_PUBLIC_BATCH_QUERY_DOWNLOAD_ROOT || "";

const parseStreamResponse = async (response) => {
  let resultText = "";
  const jsonData = [];
  const readableStream = response.body;
  const reader = readableStream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = new TextDecoder("utf-8").decode(value);
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
  return jsonData;
};

const splitResults = (jsonData: Array<any>): Array<string> => {
  const maxSizeInBytes = 500000000;
  const dataLength = jsonData.length;
  let index = 0;
  let batchSize = 5000;
  const results = [];
  let chunk = "[";
  while (jsonData.length > 0) {
    do {
      const startPos = index * batchSize;
      const endPos = Math.min((index + 1) * batchSize, dataLength);
      chunk += `${JSON.stringify(jsonData.splice(startPos, endPos)).slice(
        1,
        -1
      )},`;
    } while (
      Buffer.byteLength(chunk, "utf8") <= maxSizeInBytes &&
      jsonData.length > 0
    );
    results.push(chunk.slice(0, -1) + "]");
    chunk = "";
  }
  console.log(`BATCH-QUERY: Generated ${results.length} chunk(s)`);
  return results;
};

const createZipFile = (jsonData: Array<any>) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const splittedData = splitResults(jsonData);
  archive.on("end", () => {
    console.log(`BATCH-QUERY: Zip file size ${prettyBytes(archive.pointer())}`);
  });
  splittedData.forEach((jsonString, index) => {
    archive.append(jsonString, { name: `batch-query-results-${index}.json` });
  });
  return archive;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let response;
    console.log("BATCH-QUERY: Start request");
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
    const jsonData = await parseStreamResponse(response);
    console.log(`BATCH-QUERY: Parsed ${jsonData.length} items`);
    const archive = createZipFile(jsonData);
    archive.on("error", (err) => {
      return res.status(500).json({
        message: err,
      });
    });
    res.setHeader("Content-Type", "application/x-zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=batch-query-results.zip`
    );
    archive.pipe(res);
    await archive.finalize();
    res.end();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
