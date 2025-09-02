export interface AppSettings {
  openaiApiKey: string;
}

class SettingsService {
  private static instance: SettingsService;
  private settings: AppSettings;
  private readonly SETTINGS_FILE = 'app-settings.json';

  private constructor() {
    this.settings = {
      openaiApiKey: ''
    };
    this.loadSettings();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private async loadSettings(): Promise<void> {
    try {
      if (window.electronAPI && window.electronAPI.loadSettings) {
        const savedSettings = await window.electronAPI.loadSettings();
        if (savedSettings) {
          this.settings = { ...this.settings, ...savedSettings };
        }
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      if (window.electronAPI && window.electronAPI.saveSettings) {
        await window.electronAPI.saveSettings(this.settings);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  public getOpenAIKey(): string {
    return this.settings.openaiApiKey;
  }

  public async setOpenAIKey(key: string): Promise<void> {
    this.settings.openaiApiKey = key;
    await this.saveSettings();
  }

  public async updateSettings(newSettings: Partial<AppSettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    await this.saveSettings();
  }

  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public hasValidOpenAIKey(): boolean {
    return this.settings.openaiApiKey.trim().length > 0;
  }
}

export const settingsService = SettingsService.getInstance();
