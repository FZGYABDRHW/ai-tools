"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventParam = exports.RelatedEventEntity = exports.SLAEventGroup = void 0;
var SLAEventGroup;
(function (SLAEventGroup) {
    SLAEventGroup["GLOBAL"] = "group_event_global";
    SLAEventGroup["CONTRACTOR_TODO_PLAN_ARRIVAL"] = "group_todo_performer_plan_arrival";
})(SLAEventGroup || (exports.SLAEventGroup = SLAEventGroup = {}));
var RelatedEventEntity;
(function (RelatedEventEntity) {
    RelatedEventEntity["EVENT_CONTRACTOR_ADD_ARRIVAL"] = "event_performer_add_depart";
    RelatedEventEntity["EVENT_CONTRACTOR_ARRIVE_TO_SHOP"] = "event_performer_arrive_to_shop";
})(RelatedEventEntity || (exports.RelatedEventEntity = RelatedEventEntity = {}));
var EventParam;
(function (EventParam) {
    EventParam["SUCCESS_RATING"] = "param_sla_success_rating";
    EventParam["SLA"] = "param_sla";
})(EventParam || (exports.EventParam = EventParam = {}));
//# sourceMappingURL=interfaces.js.map