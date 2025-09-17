"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerInvoicingModes = exports.currencySymbols = exports.CurrencyCodes = void 0;
var CurrencyCodes;
(function (CurrencyCodes) {
    CurrencyCodes["PLN"] = "PLN";
    CurrencyCodes["EUR"] = "EUR";
    CurrencyCodes["GBP"] = "GBP";
    CurrencyCodes["RUB"] = "RUB";
    CurrencyCodes["NOK"] = "NOK";
    CurrencyCodes["BYN"] = "BYN";
})(CurrencyCodes || (exports.CurrencyCodes = CurrencyCodes = {}));
exports.currencySymbols = {
    [CurrencyCodes.PLN]: 'zł',
    [CurrencyCodes.EUR]: '€',
    [CurrencyCodes.GBP]: '£',
    [CurrencyCodes.RUB]: '₽',
    [CurrencyCodes.NOK]: 'NKr',
    [CurrencyCodes.BYN]: 'Br',
};
var PerformerInvoicingModes;
(function (PerformerInvoicingModes) {
    PerformerInvoicingModes["CreditNote"] = "credit_note";
    PerformerInvoicingModes["SelfInvoice"] = "self_invoice";
})(PerformerInvoicingModes || (exports.PerformerInvoicingModes = PerformerInvoicingModes = {}));
//# sourceMappingURL=interfaces.js.map