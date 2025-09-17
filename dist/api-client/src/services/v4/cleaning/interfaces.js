"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channels = exports.EventType = exports.CalendarDayStatus = exports.DayPart = exports.ScheduleType = void 0;
var ScheduleType;
(function (ScheduleType) {
    ScheduleType["DAILY"] = "weekDays";
    ScheduleType["MONTH_DAYS"] = "monthDays";
})(ScheduleType || (exports.ScheduleType = ScheduleType = {}));
var DayPart;
(function (DayPart) {
    DayPart["MORNING"] = "morning";
    DayPart["AFTERNOON"] = "afternoon";
    DayPart["EVENING"] = "evening";
    DayPart["NIGHT"] = "night";
})(DayPart || (exports.DayPart = DayPart = {}));
var CalendarDayStatus;
(function (CalendarDayStatus) {
    CalendarDayStatus["COMPLETE"] = "complete";
    CalendarDayStatus["INCOMPLETE"] = "incomplete";
    CalendarDayStatus["AWAIT"] = "await";
})(CalendarDayStatus || (exports.CalendarDayStatus = CalendarDayStatus = {}));
var EventType;
(function (EventType) {
    EventType["COMMENT"] = "comment";
    EventType["ANNOTATION"] = "annotation";
    EventType["LOG"] = "log";
})(EventType || (exports.EventType = EventType = {}));
var Channels;
(function (Channels) {
    Channels["EMAIL"] = "email";
})(Channels || (exports.Channels = Channels = {}));
//# sourceMappingURL=interfaces.js.map