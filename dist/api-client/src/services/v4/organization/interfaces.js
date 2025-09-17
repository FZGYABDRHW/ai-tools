"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentAction = exports.PaymentStatuses = exports.SIMPLE_ESTIMATE_TYPE = exports.STANDARD_ESTIMATE_TYPE = void 0;
exports.STANDARD_ESTIMATE_TYPE = 'standard';
exports.SIMPLE_ESTIMATE_TYPE = 'simple';
var PaymentStatuses;
(function (PaymentStatuses) {
    PaymentStatuses["NORMAL"] = "normal";
    PaymentStatuses["NEW"] = "new";
    PaymentStatuses["ERROR"] = "error";
    PaymentStatuses["IN_PROGRESS"] = "in_progress";
    PaymentStatuses["REJECTED"] = "rejected";
    PaymentStatuses["DEFERRED"] = "deferred";
    PaymentStatuses["CANCELED"] = "canceled";
})(PaymentStatuses || (exports.PaymentStatuses = PaymentStatuses = {}));
var PaymentAction;
(function (PaymentAction) {
    PaymentAction["Cancel"] = "cancel";
    PaymentAction["Process"] = "process";
})(PaymentAction || (exports.PaymentAction = PaymentAction = {}));
//# sourceMappingURL=interfaces.js.map