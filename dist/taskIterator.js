"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskIterator = taskIterator;
const index_1 = require("./api-client/src/services/v2/curator/task/index");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function taskIterator(si, startOffset = 0, parameters) {
    const service = si(index_1.CuratorListService);
    // Default parameters
    const defaultLimit = 30;
    const limit = parameters?.limit || defaultLimit;
    // Determine which service method to use based on task status
    const taskStatus = parameters?.taskStatus || 'in-work';
    const serviceMethod = getServiceMethod(taskStatus);
    // Build query parameters
    const queryParams = {
        limit,
        offset: startOffset
    };
    // Add time range parameters if provided
    if (parameters?.timeRangeFrom) {
        queryParams.timeRangeFrom = parameters.timeRangeFrom;
    }
    if (parameters?.timeRangeTo) {
        queryParams.timeRangeTo = parameters.timeRangeTo;
    }
    return (0, rxjs_1.defer)(() => (0, rxjs_1.from)(service[serviceMethod](queryParams))).pipe(
    // Fetch subsequent pages until a final short page is returned.
    (0, operators_1.expand)((tasks, idx) => {
        if (tasks.length < limit) {
            return rxjs_1.EMPTY;
        }
        const nextOffset = (idx + 1) * limit;
        return (0, rxjs_1.from)(service[serviceMethod]({ ...queryParams, offset: nextOffset }));
    }), 
    // Flatten each page into individual tasks.
    (0, operators_1.concatMap)((tasks) => (0, rxjs_1.from)(tasks)), 
    // Wrap each task as a content event.
    (0, operators_1.map)((task) => ({ type: 'content', taskId: task.id })), 
    // Mark stream start and end.
    (0, operators_1.startWith)({ type: 'start', task: null }), (0, operators_1.endWith)({ type: 'end', task: null }));
}
/**
 * Helper function to get the appropriate service method based on task status
 */
function getServiceMethod(status) {
    const methodMap = {
        'new': 'getNewTasks',
        'done': 'getDoneTasks',
        'canceled': 'getCanceledTasks',
        'in-work': 'getInWorkTasks',
        'on-moderation': 'getOnModerationTasks',
        'awaiting-approve': 'getOnAwaitingApprove',
        'on-payment': 'getOnPayment',
        'in-queue': 'getInQueueTasks'
    };
    return methodMap[status] || 'getInWorkTasks';
}
/**
 * Optional helper for codebases that rely on the service‑initializer
 * pattern.  It registers the ready‑to‑use iterator in the DI container.
 */
//# sourceMappingURL=taskIterator.js.map