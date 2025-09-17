"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerType = exports.TaskType = void 0;
var TaskType;
(function (TaskType) {
    TaskType[TaskType["UNKNOWN"] = 0] = "UNKNOWN";
    TaskType[TaskType["IT"] = 1] = "IT";
    TaskType[TaskType["MAINTENANCE"] = 2] = "MAINTENANCE";
    TaskType[TaskType["OTHER"] = 3] = "OTHER";
    TaskType[TaskType["CLEANING"] = 4] = "CLEANING";
    TaskType[TaskType["CASHBOX"] = 5] = "CASHBOX";
})(TaskType || (exports.TaskType = TaskType = {}));
var PerformerType;
(function (PerformerType) {
    PerformerType["ACTIVE"] = "active";
    PerformerType["INACTIVE"] = "inactive";
    PerformerType["NEW_WITHOUT_PASSPORT"] = "newWithoutPassport";
    PerformerType["NEW_WITH_PASSPORT"] = "newWithPassport";
})(PerformerType || (exports.PerformerType = PerformerType = {}));
//# sourceMappingURL=interfaces.js.map