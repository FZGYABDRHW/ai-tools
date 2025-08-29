declare global {
    interface Window {
        captchaOnLoad: () => void;
        grecaptcha: ReCaptchaInstance;
    }
}

interface ReCaptchaInstance {
    ready: (cb: () => any) => any;
    execute: (options: ReCaptchaExecuteOptions) => Promise<string>;
    render: (id: string, options: ReCaptchaRenderOptions) => any;
}
//
interface ReCaptchaExecuteOptions {
    action: string;
}

interface ReCaptchaRenderOptions {
    sitekey: string;
    size: 'invisible';
}

export class ReCaptcha {
    isReady: boolean = false;
    public action: string = 'test';
    getKey: () => void;
    private script: HTMLScriptElement;
    private widget: HTMLDivElement;
    constructor(getValidKey: () => void) {
        this.getKey = getValidKey;
        this.loadScript();
    }

    public remove = () => {
        document.body.removeChild(this.widget);
        document.body.removeChild(this.script);
    };

    public executeCaptcha = (): Promise<string> => {
        if (!this.isReady) {
            throw new Error("Captcha can be executed only when it's ready.");
        }

        return window.grecaptcha.execute({ action: this.action });
    };

    public loadScript = (): void => {
        window.captchaOnLoad = this.onLoad;

        const url = 'https://www.google.com/recaptcha/api.js';
        const queryString = '?onload=captchaOnLoad&render=explicit';
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url + queryString;
        script.async = true;
        script.defer = true;

        this.script = document.body.appendChild(script);
    };

    private onLoad = (): void => {
        const widget = document.createElement('div');
        widget.id = 'g-recaptcha';
        this.widget = document.body.appendChild(widget);

        window.grecaptcha.render('g-recaptcha', {
            sitekey: '6LdT_NAUAAAAAGiV4mBjtzutyGLCkFjOGoircaVw',
            size: 'invisible',
        });

        window.grecaptcha.ready(() => {
            this.isReady = true;
            this.getKey();
        });
    };
}
