"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReCaptcha = void 0;
class ReCaptcha {
    constructor(getValidKey) {
        this.isReady = false;
        this.action = 'test';
        this.remove = () => {
            document.body.removeChild(this.widget);
            document.body.removeChild(this.script);
        };
        this.executeCaptcha = () => {
            if (!this.isReady) {
                throw new Error("Captcha can be executed only when it's ready.");
            }
            return window.grecaptcha.execute({ action: this.action });
        };
        this.loadScript = () => {
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
        this.onLoad = () => {
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
        this.getKey = getValidKey;
        this.loadScript();
    }
}
exports.ReCaptcha = ReCaptcha;
//# sourceMappingURL=googleRecaptcha.js.map