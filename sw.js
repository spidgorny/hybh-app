"use strict";
/// <reference path="typings/index.d.ts" />
/// <reference path="typings/service-worker.d.ts" />
// https://developers.google.com/web/fundamentals/getting-started/primers/service-workers
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceWorker_1 = require("./src/ServiceWorker");
const sw = new ServiceWorker_1.default(self);
