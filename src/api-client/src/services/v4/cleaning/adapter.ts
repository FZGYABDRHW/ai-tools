import { NotificationChannel, NotificationChannels } from './interfaces';

export const notificationConfigAdapter = (
    response: NotificationChannels,
): NotificationChannel[] => {
    const notificationConfig = response.items.reduce((acc, item) => {
        return [...acc, { isEnabled: item.is_enabled, channel: item.channel }];
    }, []);
    return response.items.length !== 0 ? notificationConfig : response.items;
};
