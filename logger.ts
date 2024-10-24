import pino from "pino";

const isServer = typeof window === "undefined";
const isNextEdgeRuntime = process.env.NEXT_RUNTIME === "edge";

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  ...(isServer &&
    isNextEdgeRuntime && {
      browser: {
        write: {
          critical: (o: Object) => console.error(JSON.stringify(o)),
          debug: (o: Object) => console.log(JSON.stringify(o)),
          error: (o: Object) =>
            console.error(JSON.stringify({ ...o, level: "error" })),
          fatal: (o: Object) => console.error(JSON.stringify(o)),
          info: (o: Object) => console.log(JSON.stringify(o)),
          trace: (o: Object) => console.log(JSON.stringify(o)),
          warn: (o: Object) =>
            console.warn(JSON.stringify({ ...o, level: "warn" })),
        },
      },
    }),
});

export default logger;
