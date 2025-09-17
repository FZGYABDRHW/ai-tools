"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMessageType = exports.TicketStatusType = exports.UserGroup = void 0;
var UserGroup;
(function (UserGroup) {
    UserGroup[UserGroup["PERFORMER"] = 1] = "PERFORMER";
    UserGroup[UserGroup["ORGANIZATION"] = 2] = "ORGANIZATION";
    UserGroup[UserGroup["CURATOR"] = 3] = "CURATOR";
})(UserGroup || (exports.UserGroup = UserGroup = {}));
var TicketStatusType;
(function (TicketStatusType) {
    TicketStatusType[TicketStatusType["AWAITING"] = 1] = "AWAITING";
    TicketStatusType[TicketStatusType["IN_WORK"] = 2] = "IN_WORK";
    TicketStatusType[TicketStatusType["CURATOR_ANSWER"] = 3] = "CURATOR_ANSWER";
    TicketStatusType[TicketStatusType["CURATOR_QUESTION"] = 4] = "CURATOR_QUESTION";
    TicketStatusType[TicketStatusType["CLOSED"] = 5] = "CLOSED";
})(TicketStatusType || (exports.TicketStatusType = TicketStatusType = {}));
var TicketMessageType;
(function (TicketMessageType) {
    TicketMessageType[TicketMessageType["USER"] = 1] = "USER";
    TicketMessageType[TicketMessageType["CURATOR"] = 2] = "CURATOR";
    TicketMessageType[TicketMessageType["ANNOTATION"] = 3] = "ANNOTATION";
    TicketMessageType[TicketMessageType["LOG"] = 4] = "LOG";
    TicketMessageType[TicketMessageType["GUEST"] = 5] = "GUEST";
})(TicketMessageType || (exports.TicketMessageType = TicketMessageType = {}));
//# sourceMappingURL=interfaces.js.map