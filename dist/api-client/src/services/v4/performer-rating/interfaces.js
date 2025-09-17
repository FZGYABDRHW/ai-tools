"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGroupConstants = exports.PerformerSkillStatus = exports.RatingItemType = exports.RateType = void 0;
var RateType;
(function (RateType) {
    RateType[RateType["BONUS"] = 0] = "BONUS";
    RateType[RateType["TASK"] = 1] = "TASK";
    RateType[RateType["REPORT"] = 2] = "REPORT";
    RateType[RateType["TASK_UNASSIGN"] = 3] = "TASK_UNASSIGN";
    RateType[RateType["BAN"] = 4] = "BAN";
    RateType[RateType["PERFORMER_REFUSE"] = 5] = "PERFORMER_REFUSE";
    RateType[RateType["PENALTY"] = 6] = "PENALTY";
})(RateType || (exports.RateType = RateType = {}));
var RatingItemType;
(function (RatingItemType) {
    RatingItemType["TASK"] = "task";
    RatingItemType["BONUS"] = "bonus";
})(RatingItemType || (exports.RatingItemType = RatingItemType = {}));
var PerformerSkillStatus;
(function (PerformerSkillStatus) {
    PerformerSkillStatus["BEGINNER"] = "beginner";
    PerformerSkillStatus["EXPERIENCED"] = "experienced";
    PerformerSkillStatus["PRO"] = "pro";
})(PerformerSkillStatus || (exports.PerformerSkillStatus = PerformerSkillStatus = {}));
var NotificationGroupConstants;
(function (NotificationGroupConstants) {
    NotificationGroupConstants[NotificationGroupConstants["FIRST"] = 1] = "FIRST";
    NotificationGroupConstants[NotificationGroupConstants["SECOND"] = 2] = "SECOND";
    NotificationGroupConstants[NotificationGroupConstants["THIRD"] = 3] = "THIRD";
    NotificationGroupConstants[NotificationGroupConstants["FOURTH"] = 4] = "FOURTH";
    NotificationGroupConstants[NotificationGroupConstants["NO_GROUP"] = -1] = "NO_GROUP";
})(NotificationGroupConstants || (exports.NotificationGroupConstants = NotificationGroupConstants = {}));
//# sourceMappingURL=interfaces.js.map