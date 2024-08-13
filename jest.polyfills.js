const { TextDecoder, TextEncoder } = require('node:util');
const  { clearImmediate } = require('node:timers');
const { performance } = require("node:perf_hooks");

Object.defineProperties(globalThis, {
    TextDecoder: { value: TextDecoder },
    TextEncoder: { value: TextEncoder },
    performance: { value: performance },
    clearImmediate: {value: clearImmediate}
});

const { Blob } = require('node:buffer')
const { fetch, Headers, FormData, Request, Response } = require('undici');

Object.defineProperties(globalThis, {
    fetch: { value: fetch, writable: true },
    Blob: { value: Blob },
    Headers: { value: Headers },
    FormData: { value: FormData },
    Request: { value: Request },
    Response: { value: Response },
});

window.matchMedia = window.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    };
};