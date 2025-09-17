"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadFormat = exports.DownloadType = exports.DeliveryType = exports.DocumentStatus = exports.BillStatus = void 0;
var BillStatus;
(function (BillStatus) {
    BillStatus["PAID"] = "paid";
    BillStatus["CANCELLED"] = "cancelled";
    BillStatus["NOT_PAID"] = "not_paid";
    BillStatus["PARTIALLY_PAID"] = "partially_paid";
    BillStatus["OVERPAYMENT"] = "overpayment";
})(BillStatus || (exports.BillStatus = BillStatus = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["CREATED"] = "created";
    DocumentStatus["PREPARED"] = "prepared";
    DocumentStatus["ON_APPROVAL"] = "onApproval";
    DocumentStatus["APPROVED"] = "approved";
    DocumentStatus["NOT_APPROVED"] = "notApproved";
    DocumentStatus["SENT"] = "sent";
    DocumentStatus["SIGNED"] = "signed";
    DocumentStatus["REJECTED"] = "rejected";
    DocumentStatus["CANCELLED"] = "cancelled";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var DeliveryType;
(function (DeliveryType) {
    DeliveryType["EMAIL"] = "email";
    DeliveryType["MAIL"] = "mail";
    DeliveryType["EDMS"] = "edms";
})(DeliveryType || (exports.DeliveryType = DeliveryType = {}));
var DownloadType;
(function (DownloadType) {
    DownloadType[DownloadType["INVOICE"] = 1] = "INVOICE";
    DownloadType[DownloadType["BILL"] = 2] = "BILL";
    DownloadType[DownloadType["ACT"] = 3] = "ACT";
    DownloadType[DownloadType["TITLE"] = 4] = "TITLE";
    DownloadType[DownloadType["ARCHIVE"] = 5] = "ARCHIVE";
    DownloadType[DownloadType["ESTIMATE"] = 6] = "ESTIMATE";
    DownloadType[DownloadType["REPORT"] = 7] = "REPORT";
})(DownloadType || (exports.DownloadType = DownloadType = {}));
var DownloadFormat;
(function (DownloadFormat) {
    DownloadFormat["PDF"] = "pdf";
    DownloadFormat["XLS"] = "xls";
    DownloadFormat["ZIP"] = "zip";
})(DownloadFormat || (exports.DownloadFormat = DownloadFormat = {}));
//# sourceMappingURL=interfaces.js.map