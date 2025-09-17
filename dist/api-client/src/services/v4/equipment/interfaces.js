"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = exports.Condition = void 0;
var Condition;
(function (Condition) {
    Condition["NEW"] = "new";
    Condition["IN_WORK"] = "working";
    Condition["WRITE_OFF"] = "to_write_off";
})(Condition || (exports.Condition = Condition = {}));
var Category;
(function (Category) {
    Category["CLIMATE"] = "climate";
    Category["ELECTRICITY"] = "electricity";
    Category["ELEVATOR"] = "elevator";
    Category["FIRE_SAFETY"] = "fire_safety";
    Category["IT"] = "it";
    Category["KITCHEN_AND_REFRIGERATE"] = "kitchen_and_refrigerate";
    Category["TRADE"] = "trade";
    Category["WAREHOUSE"] = "warehouse";
    Category["PLUMBING"] = "plumbing";
})(Category || (exports.Category = Category = {}));
//# sourceMappingURL=interfaces.js.map