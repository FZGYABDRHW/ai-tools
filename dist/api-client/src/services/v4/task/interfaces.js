"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerInvoiceTargetFields = exports.InvoiceStatuses = exports.ArrivalActions = exports.EventChannels = exports.ContractorArrivalDateTriggerTypes = exports.ContractorArrivalDateStatuses = exports.TaskListOrderType = exports.TaskListSortType = exports.TaskListCleaningType = exports.TaskListType = exports.TaskProcessType = exports.TaskStatus = exports.VatStrategy = exports.EventType = exports.RefuseReasonType = void 0;
var RefuseReasonType;
(function (RefuseReasonType) {
    RefuseReasonType["DIFFICULT_TASK"] = "difficultTask";
    RefuseReasonType["INCORRECT_TASK_DESCRIPTION"] = "incorrectTaskDescription";
    RefuseReasonType["LONG_ESTIMATE_APPROVAL"] = "longEstimateApproval";
    RefuseReasonType["TAKEN_BY_MISTAKE"] = "takenByMistake";
    RefuseReasonType["UNSATISFACTORY_PRICE"] = "unsatisfactoryPrice";
    RefuseReasonType["ANOTHER_REASON"] = "anotherReason";
})(RefuseReasonType || (exports.RefuseReasonType = RefuseReasonType = {}));
var EventType;
(function (EventType) {
    EventType["ANNOTATION"] = "annotation";
    EventType["COMMENT"] = "comment";
    EventType["LOG"] = "log";
})(EventType || (exports.EventType = EventType = {}));
var VatStrategy;
(function (VatStrategy) {
    VatStrategy["COMMON"] = "common";
    VatStrategy["CONSTRUCTION_WORKS"] = "construction_works";
})(VatStrategy || (exports.VatStrategy = VatStrategy = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["ON_MODERATION"] = 1] = "ON_MODERATION";
    TaskStatus[TaskStatus["NEW"] = 2] = "NEW";
    TaskStatus[TaskStatus["IN_WORK"] = 3] = "IN_WORK";
    TaskStatus[TaskStatus["AWAITING_APPROVE"] = 4] = "AWAITING_APPROVE";
    TaskStatus[TaskStatus["DONE"] = 5] = "DONE";
    TaskStatus[TaskStatus["CANCELED"] = 6] = "CANCELED";
    TaskStatus[TaskStatus["DRAFT"] = 7] = "DRAFT";
    TaskStatus[TaskStatus["REJECTED"] = 8] = "REJECTED";
    TaskStatus[TaskStatus["ON_PAYMENT"] = 9] = "ON_PAYMENT";
    TaskStatus[TaskStatus["STATUS_AWAITING_SERVICE_APPROVE"] = 10] = "STATUS_AWAITING_SERVICE_APPROVE";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskProcessType;
(function (TaskProcessType) {
    TaskProcessType["b2c"] = "B2C";
    TaskProcessType["b2b2c"] = "B2B2C";
    TaskProcessType["common"] = "common";
    TaskProcessType["delivery"] = "delivery";
})(TaskProcessType || (exports.TaskProcessType = TaskProcessType = {}));
var TaskListType;
(function (TaskListType) {
    TaskListType["STATUS_ON_MODERATION_NAME"] = "onModeration";
    TaskListType["STATUS_ON_PAYMENT_NAME"] = "onPayment";
    TaskListType["STATUS_NEW_NAME"] = "new";
    TaskListType["STATUS_IN_WORK_NAME"] = "inWork";
    TaskListType["STATUS_AWAITING_APPROVE_NAME"] = "awaitingApprove";
    TaskListType["STATUS_DONE_NAME"] = "done";
    TaskListType["STATUS_CANCELED_NAME"] = "canceled";
    TaskListType["STATUS_DRAFT_NAME"] = "draft";
    TaskListType["STATUS_REJECTED_NAME"] = "rejected";
})(TaskListType || (exports.TaskListType = TaskListType = {}));
var TaskListCleaningType;
(function (TaskListCleaningType) {
    TaskListCleaningType["inWork"] = "inWork";
    TaskListCleaningType["paid"] = "paid";
})(TaskListCleaningType || (exports.TaskListCleaningType = TaskListCleaningType = {}));
var TaskListSortType;
(function (TaskListSortType) {
    TaskListSortType["CREATE_DATE"] = "createDate";
    TaskListSortType["ORGANIZATION_CONFIRM_DATE"] = "organizationConfirmDate";
})(TaskListSortType || (exports.TaskListSortType = TaskListSortType = {}));
var TaskListOrderType;
(function (TaskListOrderType) {
    TaskListOrderType["ASC"] = "asc";
    TaskListOrderType["DESC"] = "desc";
})(TaskListOrderType || (exports.TaskListOrderType = TaskListOrderType = {}));
var ContractorArrivalDateStatuses;
(function (ContractorArrivalDateStatuses) {
    ContractorArrivalDateStatuses["PLANNED"] = "planned";
    ContractorArrivalDateStatuses["DONE"] = "done";
    ContractorArrivalDateStatuses["FAILED"] = "failed";
    ContractorArrivalDateStatuses["MOVED"] = "moved";
    ContractorArrivalDateStatuses["CANCELED"] = "canceled";
})(ContractorArrivalDateStatuses || (exports.ContractorArrivalDateStatuses = ContractorArrivalDateStatuses = {}));
var ContractorArrivalDateTriggerTypes;
(function (ContractorArrivalDateTriggerTypes) {
    ContractorArrivalDateTriggerTypes["APP_GPS"] = "app_gps";
    ContractorArrivalDateTriggerTypes["PERFORMER_MANUAL"] = "performer_manual";
    ContractorArrivalDateTriggerTypes["CURATOR_MANUAL"] = "curator_manual";
    ContractorArrivalDateTriggerTypes["SYSTEM"] = "system";
})(ContractorArrivalDateTriggerTypes || (exports.ContractorArrivalDateTriggerTypes = ContractorArrivalDateTriggerTypes = {}));
var EventChannels;
(function (EventChannels) {
    EventChannels["EMAIL"] = "email";
})(EventChannels || (exports.EventChannels = EventChannels = {}));
var ArrivalActions;
(function (ArrivalActions) {
    ArrivalActions["ARRIVE"] = "arrive";
    ArrivalActions["CANCEL"] = "cancel";
    ArrivalActions["MOVE"] = "move";
})(ArrivalActions || (exports.ArrivalActions = ArrivalActions = {}));
var InvoiceStatuses;
(function (InvoiceStatuses) {
    InvoiceStatuses["MODERATE"] = "onCuratorModeration";
    InvoiceStatuses["APPROVED"] = "approved";
})(InvoiceStatuses || (exports.InvoiceStatuses = InvoiceStatuses = {}));
var PerformerInvoiceTargetFields;
(function (PerformerInvoiceTargetFields) {
    PerformerInvoiceTargetFields["NUMBER"] = "number";
    PerformerInvoiceTargetFields["DATE"] = "date";
    PerformerInvoiceTargetFields["SUM"] = "paidSumWithoutVAT";
    PerformerInvoiceTargetFields["FILE_IDS"] = "file_ids";
})(PerformerInvoiceTargetFields || (exports.PerformerInvoiceTargetFields = PerformerInvoiceTargetFields = {}));
//# sourceMappingURL=interfaces.js.map