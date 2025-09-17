"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCanceled = exports.isMoved = exports.isFailed = exports.isDone = exports.isPlanned = void 0;
const interfaces_1 = require("./interfaces");
const extractStatus = (arrival) => arrival.status;
const isPlanned = arrival => extractStatus(arrival) === interfaces_1.ContractorArrivalDateStatuses.PLANNED;
exports.isPlanned = isPlanned;
const isDone = arrival => extractStatus(arrival) === interfaces_1.ContractorArrivalDateStatuses.DONE;
exports.isDone = isDone;
const isFailed = arrival => extractStatus(arrival) === interfaces_1.ContractorArrivalDateStatuses.FAILED;
exports.isFailed = isFailed;
const isMoved = arrival => extractStatus(arrival) === interfaces_1.ContractorArrivalDateStatuses.MOVED;
exports.isMoved = isMoved;
const isCanceled = arrival => extractStatus(arrival) === interfaces_1.ContractorArrivalDateStatuses.CANCELED;
exports.isCanceled = isCanceled;
//# sourceMappingURL=contractorArrivalHelper.js.map