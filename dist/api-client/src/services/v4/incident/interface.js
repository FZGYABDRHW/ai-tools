"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefuseReasons = exports.CategoryType = exports.StepIncident = exports.TaskStatusStepType = exports.OrderType = exports.SortType = exports.ExecutionAddressType = void 0;
var ExecutionAddressType;
(function (ExecutionAddressType) {
    ExecutionAddressType["EXECUTION_ADRESS"] = "executionAddress";
    ExecutionAddressType["SHOP"] = "shop";
})(ExecutionAddressType || (exports.ExecutionAddressType = ExecutionAddressType = {}));
var SortType;
(function (SortType) {
    SortType["URGENT"] = "isUrgent";
    SortType["CREATED"] = "createdAt";
    SortType["LIMIT_DATE"] = "limitDate";
    SortType["STATUS"] = "status";
    SortType["COMMENTS"] = "countUnreadComments";
})(SortType || (exports.SortType = SortType = {}));
var OrderType;
(function (OrderType) {
    OrderType["DESC"] = "desc";
    OrderType["ASC"] = "asc";
})(OrderType || (exports.OrderType = OrderType = {}));
var TaskStatusStepType;
(function (TaskStatusStepType) {
    TaskStatusStepType["FIND_PERFORMER"] = "find_performer";
    TaskStatusStepType["PERFORMER_APPOINTED"] = "performer_appointed";
    TaskStatusStepType["IN_WORK"] = "in_work";
    TaskStatusStepType["AWAITING_APPROVE"] = "awaiting_approve";
    TaskStatusStepType["DONE"] = "done";
})(TaskStatusStepType || (exports.TaskStatusStepType = TaskStatusStepType = {}));
var StepIncident;
(function (StepIncident) {
    StepIncident["INITIAL"] = "stepAssignContractorCompany";
    StepIncident["IN_WORK"] = "stepInWork";
    StepIncident["DONE"] = "stepDone";
})(StepIncident || (exports.StepIncident = StepIncident = {}));
var CategoryType;
(function (CategoryType) {
    CategoryType["SHOP"] = "shop";
    CategoryType["EQUIPMENT"] = "equipment";
})(CategoryType || (exports.CategoryType = CategoryType = {}));
var RefuseReasons;
(function (RefuseReasons) {
    RefuseReasons["NO_TIME"] = "no_time";
    RefuseReasons["NOT_MY_SPECIALIZATION"] = "not_my_specialization";
    RefuseReasons["NOT_MY_TERRITORY"] = "not_my_territory";
    RefuseReasons["PROBLEM_WITH_CUSTOMER"] = "problem_with_customer";
})(RefuseReasons || (exports.RefuseReasons = RefuseReasons = {}));
//# sourceMappingURL=interface.js.map