"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsService = void 0;
class SettingsService {
    constructor() {
        this.SETTINGS_FILE = 'app-settings.json';
        this.settings = {
            openaiApiKey: '',
            concurrencyLimit: 2
        };
        this.loadSettings();
    }
    static getInstance() {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }
        return SettingsService.instance;
    }
    async loadSettings() {
        try {
            if (window.electronAPI && window.electronAPI.loadSettings) {
                const savedSettings = await window.electronAPI.loadSettings();
                if (savedSettings) {
                    this.settings = { ...this.settings, ...savedSettings };
                }
            }
        }
        catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }
    async saveSettings() {
        try {
            if (window.electronAPI && window.electronAPI.saveSettings) {
                await window.electronAPI.saveSettings(this.settings);
            }
        }
        catch (error) {
            console.error('Failed to save settings:', error);
            throw error;
        }
    }
    getOpenAIKey() {
        return this.settings.openaiApiKey;
    }
    async setOpenAIKey(key) {
        this.settings.openaiApiKey = key;
        await this.saveSettings();
    }
    async updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        await this.saveSettings();
    }
    getSettings() {
        return { ...this.settings };
    }
    hasValidOpenAIKey() {
        return this.settings.openaiApiKey.trim().length > 0;
    }
    getConcurrencyLimit() {
        return Math.max(1, this.settings.concurrencyLimit || 2);
    }
    async setConcurrencyLimit(limit) {
        this.settings.concurrencyLimit = Math.max(1, limit);
        await this.saveSettings();
    }
}
exports.settingsService = SettingsService.getInstance();
//# sourceMappingURL=settingsService.js.map