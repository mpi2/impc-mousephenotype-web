// Function to check if iframe is loaded
// Ideally this should go in node-modules but will keep here for dev.
export function isIframeLoaded(iframe) {
    console.log("Loading iframe");
    return new Promise((resolve, reject) => {
        if (!iframe) {
            reject("No iframe found");
        }
        iframe.addEventListener('load', () => resolve(iframe));
        iframe.addEventListener('error', () => reject("Error loading iframe"));

        // Additional check if iframe is already loaded
        const timer = setInterval(() => {
            if (iframe.contentWindow) {
                clearInterval(timer);
                resolve(iframe);
            }
        }, 100);
    });
}