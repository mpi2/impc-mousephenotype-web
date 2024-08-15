export async function initMocks() {
  if (typeof window === "undefined") {
    const { server } = await import("./server");
    server.listen();
  } else {
    const { worker } = await import("./browser");
    return worker.start({
      serviceWorker: {
        url: "/data/mockServiceWorker.js",
        options: {
          scope: "/",
        }
      }
    });
  }
}

