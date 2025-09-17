"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutType = exports.PerformerWalletTypes = exports.SELF_EMPLOYED_WALLET_TYPE = exports.INDIVIDUAL_ENTERPRENEUR_WALLET_TYPE = exports.WORK_WALLET_TYPE = exports.TOTAL_WALLET_TYPE = exports.EXPENDABLE_WALLET_TYPE = void 0;
exports.EXPENDABLE_WALLET_TYPE = 'expendable';
exports.TOTAL_WALLET_TYPE = 'total';
exports.WORK_WALLET_TYPE = 'work';
exports.INDIVIDUAL_ENTERPRENEUR_WALLET_TYPE = 'ie';
exports.SELF_EMPLOYED_WALLET_TYPE = 'self_employed';
var PerformerWalletTypes;
(function (PerformerWalletTypes) {
    PerformerWalletTypes["Work"] = "work";
    PerformerWalletTypes["Expendable"] = "expendable";
    PerformerWalletTypes["SelfEmployed"] = "selfEmployed";
    PerformerWalletTypes["IE"] = "ie";
})(PerformerWalletTypes || (exports.PerformerWalletTypes = PerformerWalletTypes = {}));
var PayoutType;
(function (PayoutType) {
    PayoutType["QIWI"] = "qiwi";
    PayoutType["CARD"] = "card";
    PayoutType["IE"] = "ie";
    PayoutType["SELF_EMPLOYED"] = "self_employed";
})(PayoutType || (exports.PayoutType = PayoutType = {}));
//# sourceMappingURL=interfaces.js.map