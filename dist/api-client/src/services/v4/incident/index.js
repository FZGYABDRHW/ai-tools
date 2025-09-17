"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentService = exports.TypeStatusIncident = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
var TypeStatusIncident;
(function (TypeStatusIncident) {
    TypeStatusIncident["NEW"] = "new";
    TypeStatusIncident["IN_WORK"] = "inWork";
    TypeStatusIncident["CLOSED"] = "closed";
    TypeStatusIncident["CANCELLED"] = "cancelled";
    TypeStatusIncident["ON_CONFIRMATION"] = "completed";
})(TypeStatusIncident || (exports.TypeStatusIncident = TypeStatusIncident = {}));
const composeIncidentAndAdditionalInfo = (incident, [contractorCompany, commentariesUnreadCounterInfo]) => ({
    ...incident,
    contractorCompany,
    commentariesUnreadCounterInfo,
});
const composeIncidentAndEventsCount = (incident, commentariesUnreadCounterInfo) => ({
    ...incident,
    commentariesUnreadCounterInfo,
});
class IncidentService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/incident`;
        this.urlRoute = `${this.url}/category/route/shop`;
        this.setStepIncident = (incidentId, params) => this.http
            .patch(`${this.url}/${incidentId}/set-step`, params)
            .then(resp => resp.data.response);
        this.createRoute = (data) => this.http.post(this.urlRoute, data).then(resp => resp.data.response);
        this.getRoutes = (params) => this.http
            .get(this.urlRoute, { params })
            .then(resp => resp.data.response);
        this.getCategories = (params) => this.http
            .get(`${this.url}/categories`, { params })
            .then(resp => resp.data.response);
        this.getControls = (incidentId) => this.http
            .get(`${this.url}/${incidentId}/controls`)
            .then(resp => resp.data.response);
        this.getCategory = (id) => this.http
            .get(`${this.url}/category/${id}`)
            .then(resp => resp.data.response);
        this.deleteCategory = (id, options) => this.http.delete(`${this.url}/category/${id}`, options).then(resp => resp.data.response);
        this.createCategory = ({ name, organization_id }) => this.http
            .post(`${this.url}/category`, { name, organization_id })
            .then(resp => resp.data.response);
        this.editCategory = ({ name, id }) => this.http.put(`${this.url}/category`, { name, id }).then(resp => resp.data.response);
        this.editCategoryName = ({ id, name }) => this.http.patch(`${this.url}/category/${id}`, { name }).then(resp => resp.data.response);
        this.assignContractorCompany = ({ contractor_company_id, incident_id, }) => this.http
            .post(`${this.url}/${incident_id}/assign-contractor-company`, { contractor_company_id })
            .then(resp => resp.data.response);
        this.refuseIncident = (incidentId, params) => this.http.post(`${this.url}/${incidentId}/refuse`, params).then(resp => resp.data.response);
        this.cancelIncident = (incidentId) => this.http.patch(`${this.url}/${incidentId}/cancel`).then(resp => resp.data.response);
        this.assignedContractorCompany = (incident_id) => this.http
            .get(`${this.url}/${incident_id}/contractor-company`)
            .then(resp => resp.data.response);
        this.downloadAttachment = (params) => {
            const absoluteUrl = `${this.http.config.baseURL}${this.url}`;
            return `${absoluteUrl}/${params.incidentId}/attachment/${params.attachmentId}/download?&access-token=${params.token}`;
        };
        this.getList = (params, options) => this.http
            .get(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);
        this.getListWithEventsCount = params => this.getList(params).then(({ items, totalCount }) => Promise.all(items.map(incident => this.getCommentariesUnreadCounterInfo(incident.id)
            .catch(() => void 0)
            .then(commentariesUnreadCounterInfo => composeIncidentAndEventsCount(incident, commentariesUnreadCounterInfo)))).then(newItems => ({ totalCount, items: newItems })));
        this.getEntityIncidentLinkList = (params, options) => this.http
            .get(`${this.url}/entity-link`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.createIncident = (data, options) => this.http
            .post(`${this.url}`, data, options)
            .then(resp => resp.data.response);
        this.createEntityIncidentLinkList = (id, params, options) => this.http
            .post(`${this.url}/${id}/entity-link`, params, options)
            .then(resp => resp.data.response);
        this.deleteEntityIncidentLink = (entityLinkId, options) => this.http
            .delete(`${this.url}/entity-link/${entityLinkId}`, options)
            .then(resp => resp.data.response);
        this.getIncident = (incidentId, options) => this.http
            .get(`${this.url}/${incidentId}`)
            .then(resp => resp.data.response);
        this.getStatusDetailsIncident = (incidentId, options) => this.http
            .get(`${this.url}/${incidentId}/status-details`, options)
            .then(resp => resp.data.response);
        this.updateIncident = (incidentId, params, options) => this.http
            .patch(`${this.url}/${incidentId}`, params, options)
            .then(resp => resp.data.response);
        this.updateEntityIncidentLink = (entityLinkId, params, options) => this.http
            .put(`${this.url}/entity-link/${entityLinkId}`, params, options)
            .then(resp => resp.data.response);
        this.getAttachmentsList = (incidentId, options) => this.http
            .get(`${this.url}/${incidentId}/attachments`, options)
            .then(resp => resp.data.response);
        this.getEventsList = (incidentId, params, options) => this.http
            .get(`${this.url}/${incidentId}/comments`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.createLinkAttachment = (id, params, options) => this.http
            .post(`${this.url}/${id}/attachment`, params, options)
            .then(resp => resp.data.response);
        this.linkLocation = (incidentId) => this.http
            .patch(`${this.url}/${incidentId}/link-location`)
            .then(resp => resp.data.response);
        this.getResponsiblePerson = (id, options) => this.http
            .get(`${this.url}/${id}/responsible-user`, options)
            .then(resp => resp.data.response);
        this.assignResponsiblePerson = (id, params, options) => this.http
            .post(`${this.url}/${id}/assign-responsible-user`, params, options)
            .then(resp => resp.data.response);
        this.postComment = (incidentId, params, options) => this.http
            .post(`${this.url}/${incidentId}/comment`, params, options)
            .then(resp => resp.data.response);
        this.getContractorCompany = incidentId => this.http
            .get(`${this.url}/${incidentId}/contractor-company`, {})
            .then(resp => resp.data.response || void 0);
        this.getCommentariesUnreadCounterInfo = incidentId => this.http
            .get(`${this.url}/${incidentId}/comments/unread-count`, {})
            .then(resp => resp.data.response || void 0)
            .then(count => {
            if (count) {
                return { count };
            }
            else {
                return void 0;
            }
        });
        this.getListWithAdditionalInfo = params => this.getList(params).then(({ items, totalCount }) => Promise.all(items.map(incident => Promise.all([
            this.getContractorCompany(incident.id).catch(() => void 0),
            this.getCommentariesUnreadCounterInfo(incident.id).catch(() => void 0),
        ]).then(additionalInfo => composeIncidentAndAdditionalInfo(incident, additionalInfo)))).then(newItems => ({ totalCount, items: newItems })));
        this.markCommentsAsRead = (incidentId) => this.http
            .patch(`${this.url}/${incidentId}/comments/read`)
            .then(resp => resp.data.response);
        this.getLogs = (incidentId, params, options) => this.http
            .get(`${this.url}/${incidentId}/log`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.IncidentService = IncidentService;
//# sourceMappingURL=index.js.map