/// <reference path="typings/index.d.ts" />
/// <reference path="typings/service-worker.d.ts" />
// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers

import ServiceWorker from "./src/ServiceWorker";

const sw = new ServiceWorker(self);
