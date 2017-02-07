/// <reference path="typings/index.d.ts" />
/// <reference path="typings/service-worker.d.ts" />
// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
"use strict";
var ServiceWorker_1 = require("./src/ServiceWorker");
var sw = new ServiceWorker_1.default(self);
