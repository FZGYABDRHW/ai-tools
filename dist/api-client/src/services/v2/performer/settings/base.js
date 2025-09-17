"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerToolsService = exports.TelegramService = exports.PerformerSkillsService = exports.RegionService = exports.PersonalService = exports.PassportService = exports.NotificationsService = exports.IndividualEntrepreneurService = exports.ContactsService = exports.SettingsBaseService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
const md5_1 = require("ts-md5/dist/md5");
const contacts_1 = require("./contacts");
Object.defineProperty(exports, "ContactsService", { enumerable: true, get: function () { return contacts_1.ContactsService; } });
const individual_entrepreneur_1 = require("./individual-entrepreneur");
Object.defineProperty(exports, "IndividualEntrepreneurService", { enumerable: true, get: function () { return individual_entrepreneur_1.IndividualEntrepreneurService; } });
const notifications_1 = require("./notifications");
Object.defineProperty(exports, "NotificationsService", { enumerable: true, get: function () { return notifications_1.NotificationsService; } });
const passport_1 = require("./passport");
Object.defineProperty(exports, "PassportService", { enumerable: true, get: function () { return passport_1.PassportService; } });
const personal_1 = require("./personal");
Object.defineProperty(exports, "PersonalService", { enumerable: true, get: function () { return personal_1.PersonalService; } });
const regions_1 = require("./regions");
Object.defineProperty(exports, "RegionService", { enumerable: true, get: function () { return regions_1.RegionService; } });
const skills_1 = require("./skills");
Object.defineProperty(exports, "PerformerSkillsService", { enumerable: true, get: function () { return skills_1.PerformerSkillsService; } });
const telegram_1 = require("./telegram");
Object.defineProperty(exports, "TelegramService", { enumerable: true, get: function () { return telegram_1.TelegramService; } });
const tools_1 = require("./tools");
Object.defineProperty(exports, "PerformerToolsService", { enumerable: true, get: function () { return tools_1.PerformerToolsService; } });
class SettingsBaseService extends BaseServiceV2_1.default {
    async getUserAvatar(options) {
        const url = `${this.baseUrl}/performer/settings/avatar`;
        const { data: { response }, } = await this.http.get(url, options);
        return response;
    }
    async changePassword(oldPassword, newPassword, newPasswordRepeat, options) {
        const params = {
            old_password: md5_1.Md5.hashStr(oldPassword),
            new_password: md5_1.Md5.hashStr(newPassword),
            new_password_repeat: md5_1.Md5.hashStr(newPasswordRepeat),
        };
        const url = `${this.baseUrl}/performer/settings/password`;
        const { data: { status }, } = await this.http.post(url, params, options);
        return status;
    }
    async removeAccount(accept, options) {
        const url = `${this.baseUrl}/performer/settings/account`;
        const { data: { response }, } = await this.http.delete(url, { params: { accepted: accept }, ...options });
        return response;
    }
    async getStepsStatus(options) {
        const url = `${this.baseUrl}/performer/settings/validation`;
        const { data: { response }, } = await this.http.get(url, options);
        return response;
    }
    async registration(params, options) {
        const url = `${this.baseUrl}/performer/settings/intro-questionnaire`;
        const { data } = await this.http.post(url, params, options);
        return data;
    }
}
exports.default = SettingsBaseService;
exports.SettingsBaseService = SettingsBaseService;
//# sourceMappingURL=base.js.map