// eslint-disable-next-line import/namespace
import {buildServiceInitializer, ServiceInitializer} from "./serviceInit";
import {TaskService} from "./api-client/src/services/v4/task";
import {OrganizationService} from "./api-client/src/services/v4/organization";
import {GetEventsParams, Event} from "./api-client/src/services/v4/task/interfaces";
import {UserService} from "./api-client/src/services/v4/user";
import {User} from "./api-client/src/services/v4/user/interfaces";


const eventToString = ([event, user]: [Event, User]): string => (
    `
        Author: ${user.firstName} ${user.secondName} \n
        Date: ${event.addDate} \n
        Type: ${event.type} \n
        Text: ${event.text} \n
    `
)


// eslint-disable-next-line @typescript-eslint/no-empty-function
const buildEventsText = async (taskId: number, si: ServiceInitializer) => {
    const taskService = si(TaskService);
    const userService = si(UserService);
    const result: Event[] = [];
    const stack: GetEventsParams[] = [{limit: 10, offset: 0}];
    while (stack.length > 0) {
        const params = stack.pop();
        const eventList = await taskService.getEvents(taskId, params);
        if (eventList.items.length) {
            result.push(...eventList.items);
            stack.push({limit: 10, offset: params.offset + 10});
        }
    }

    const mergedData = await Promise.all(
        result.map(
            (event) => userService
                .get(event.userId)
                .then((value) => value.response)
                .then((user) => [event, user] as [Event, User])
        )
    )

    return mergedData.map(eventToString).join('\n')
};

export default async (taskId: number, token: string): Promise<string> => {
    const si = buildServiceInitializer(token);
    const {name, description, organizationId} = await si(TaskService).get(taskId);
    const {brand} = await si(OrganizationService).get(organizationId);
    const eventsText = await buildEventsText(taskId, si);
    return `
        Name: ${name} \n
        Description: ${description} \n
        Brand: ${brand} \n 
        ############## Comments and Logs ##############
        ${eventsText}     
    `
}