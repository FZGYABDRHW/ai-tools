"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/namespace
const serviceInit_1 = require("./serviceInit");
const task_1 = require("./api-client/src/services/v4/task");
const organization_1 = require("./api-client/src/services/v4/organization");
const user_1 = require("./api-client/src/services/v4/user");
const eventToString = ([event, user]) => (`
        Author: ${user.firstName} ${user.secondName} \n
        Date: ${event.addDate} \n
        Type: ${event.type} \n
        Text: ${event.text} \n
    `);
// eslint-disable-next-line @typescript-eslint/no-empty-function
const buildEventsText = async (taskId, si) => {
    const taskService = si(task_1.TaskService);
    const userService = si(user_1.UserService);
    const result = [];
    const stack = [{ limit: 10, offset: 0 }];
    while (stack.length > 0) {
        const params = stack.pop();
        const eventList = await taskService.getEvents(taskId, params);
        if (eventList.items.length) {
            result.push(...eventList.items);
            stack.push({ limit: 10, offset: params.offset + 10 });
        }
    }
    const mergedData = await Promise.all(result.map((event) => userService
        .get(event.userId)
        .then((value) => value.response)
        .then((user) => [event, user])));
    return mergedData.map(eventToString).join('\n');
};
exports.default = async (taskId, token, selectedServer = 'EU') => {
    const si = (0, serviceInit_1.buildServiceInitializer)(token, selectedServer);
    const { name, description, organizationId } = await si(task_1.TaskService).get(taskId);
    const { brand } = await si(organization_1.OrganizationService).get(organizationId);
    const eventsText = await buildEventsText(taskId, si);
    return `
        Name: ${name} \n
        Description: ${description} \n
        Brand: ${brand} \n 
        ############## Comments and Logs ##############
        ${eventsText}     
    `;
};
//# sourceMappingURL=builder.js.map