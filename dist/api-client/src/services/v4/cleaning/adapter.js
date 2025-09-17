"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationConfigAdapter = void 0;
const notificationConfigAdapter = (response) => {
    const notificationConfig = response.items.reduce((acc, item) => {
        return [...acc, { isEnabled: item.is_enabled, channel: item.channel }];
    }, []);
    return notificationConfig;
};
exports.notificationConfigAdapter = notificationConfigAdapter;
//# sourceMappingURL=adapter.js.map