"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELIVERY_PLACE_POINT = exports.DELIVERY_PLACE_SHOP = exports.UpdateExpendableActions = exports.UpdateWorkActions = exports.DEFAULT_WORKS_LIMIT = exports.DEFAULT_EXPENDABLES_LIMIT = exports.EXPENDABLES_DELIVERY = exports.ETADetailsConstants = exports.ExpendableStatus = exports.WorkStatus = exports.TaskType = exports.EstimateAction = exports.ExpendableType = exports.WorkType = exports.EstimateStatus = exports.EstimateEventType = void 0;
var EstimateEventType;
(function (EstimateEventType) {
    EstimateEventType["ESTIMATE_COMMENT_EVENT_TYPE"] = "estimate_comment";
    EstimateEventType["ESTIMATE_ANNOTATION_EVENT_TYPE"] = "estimate_annotation";
    EstimateEventType["ESTIMATE_LOG_EVENT_TYPE"] = "log";
})(EstimateEventType || (exports.EstimateEventType = EstimateEventType = {}));
var EstimateStatus;
(function (EstimateStatus) {
    EstimateStatus["PRIMARY_ESTIMATE_STATUS"] = "primary";
    EstimateStatus["REJECTED_ESTIMATE_STATUS"] = "rejected";
    EstimateStatus["ON_CURATOR_MODERATION_ESTIMATE_STATUS"] = "on_curator_moderation";
    EstimateStatus["ON_CUSTOMER_APPROVAL_ESTIMATE_STATUS"] = "on_customer_approval";
    EstimateStatus["ON_PURCHASE_MODERATION_ESTIMATE_STATUS"] = "on_purchase_moderation";
    EstimateStatus["APPROVED_ESTIMATE_STATUS"] = "approved";
    EstimateStatus["IN_WORK_ESTIMATE_STATUS"] = "in_work";
    EstimateStatus["DONE_ESTIMATE_STATUS"] = "done";
    EstimateStatus["CANCELED_ESTIMATE_STATUS"] = "canceled";
})(EstimateStatus || (exports.EstimateStatus = EstimateStatus = {}));
var WorkType;
(function (WorkType) {
    WorkType[WorkType["DEFAULT"] = 1] = "DEFAULT";
    WorkType[WorkType["HIDDEN"] = 2] = "HIDDEN";
})(WorkType || (exports.WorkType = WorkType = {}));
var ExpendableType;
(function (ExpendableType) {
    ExpendableType[ExpendableType["DEFAULT"] = 1] = "DEFAULT";
    ExpendableType[ExpendableType["HIDDEN"] = 2] = "HIDDEN";
    ExpendableType[ExpendableType["ADHERENT"] = 3] = "ADHERENT";
})(ExpendableType || (exports.ExpendableType = ExpendableType = {}));
var EstimateAction;
(function (EstimateAction) {
    EstimateAction["ACCEPT_ACTION"] = "accept";
    EstimateAction["CREATE_ACTION"] = "create";
    EstimateAction["REJECT_ACTION"] = "reject";
    EstimateAction["UPDATE_ACTION"] = "update";
    EstimateAction["DELETE_ACTION"] = "delete";
    EstimateAction["CANCEL_ACTION"] = "cancel";
    EstimateAction["UPDATE_PRICE_ORGANIZATION_ACTION"] = "updatePriceOrganization";
    EstimateAction["PAID_BY_WOWWORKS_ACTION"] = "paidByWowworks";
    EstimateAction["PAID_BY_CUSTOMER_ACTION"] = "paidByCustomer";
})(EstimateAction || (exports.EstimateAction = EstimateAction = {}));
var TaskType;
(function (TaskType) {
    TaskType[TaskType["NIGHT"] = 7] = "NIGHT";
    TaskType[TaskType["URGENT"] = 8] = "URGENT";
    TaskType[TaskType["ALTITUDE_WORK"] = 9] = "ALTITUDE_WORK";
    TaskType[TaskType["ARRIVE_ON_TIME"] = 10] = "ARRIVE_ON_TIME";
})(TaskType || (exports.TaskType = TaskType = {}));
var WorkStatus;
(function (WorkStatus) {
    WorkStatus["ACCEPTED_WORK_STATUS"] = "accepted";
    WorkStatus["APPROVED_WORK_STATUS"] = "approved";
    WorkStatus["REQUESTED_WORK_STATUS"] = "requested";
    WorkStatus["REJECTED_WORK_STATUS"] = "rejected";
})(WorkStatus || (exports.WorkStatus = WorkStatus = {}));
var ExpendableStatus;
(function (ExpendableStatus) {
    ExpendableStatus[ExpendableStatus["REQUESTED"] = 0] = "REQUESTED";
    ExpendableStatus[ExpendableStatus["ACCEPTED"] = 1] = "ACCEPTED";
    ExpendableStatus[ExpendableStatus["REJECTED"] = 2] = "REJECTED";
    ExpendableStatus[ExpendableStatus["DELETED"] = 3] = "DELETED";
    ExpendableStatus[ExpendableStatus["DELETE_REQUESTED"] = 4] = "DELETE_REQUESTED";
    ExpendableStatus[ExpendableStatus["EDIT_REQUESTED"] = 5] = "EDIT_REQUESTED";
    ExpendableStatus[ExpendableStatus["APPROVED"] = 6] = "APPROVED";
    ExpendableStatus[ExpendableStatus["AWAITING_DELIVERY"] = 7] = "AWAITING_DELIVERY";
    ExpendableStatus[ExpendableStatus["DELIVERED"] = 8] = "DELIVERED";
})(ExpendableStatus || (exports.ExpendableStatus = ExpendableStatus = {}));
var ETADetailsConstants;
(function (ETADetailsConstants) {
    ETADetailsConstants["ETA"] = "eta";
    ETADetailsConstants["ARRIVAL_TIME"] = "arrivalTime";
    ETADetailsConstants["EXPENDABLES_TIME"] = "expendablesTime";
    ETADetailsConstants["PASS_TIME"] = "passTime";
    ETADetailsConstants["EDIT_ESTIMATE_TIME"] = "editEstimateTime";
})(ETADetailsConstants || (exports.ETADetailsConstants = ETADetailsConstants = {}));
exports.EXPENDABLES_DELIVERY = 10115;
exports.DEFAULT_EXPENDABLES_LIMIT = 100;
exports.DEFAULT_WORKS_LIMIT = 100;
var UpdateWorkActions;
(function (UpdateWorkActions) {
    UpdateWorkActions["CANCEL"] = "cancel";
    UpdateWorkActions["DELETE"] = "delete";
    UpdateWorkActions["UPDATE"] = "update";
})(UpdateWorkActions || (exports.UpdateWorkActions = UpdateWorkActions = {}));
var UpdateExpendableActions;
(function (UpdateExpendableActions) {
    UpdateExpendableActions["UPDATE"] = "update";
    UpdateExpendableActions["ACCEPT"] = "accept";
    UpdateExpendableActions["DELETE"] = "delete";
    UpdateExpendableActions["CANCEL"] = "cancel";
})(UpdateExpendableActions || (exports.UpdateExpendableActions = UpdateExpendableActions = {}));
exports.DELIVERY_PLACE_SHOP = 'delivery_place_shop';
exports.DELIVERY_PLACE_POINT = 'delivery_place_point';
//# sourceMappingURL=interfaces.js.map