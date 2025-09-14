declare module 'logrocket' {
    interface LogRocket {
        init(appId: string): void;
        identify(userId: string, userData?: Record<string, any>): void;
        track(eventName: string, properties?: Record<string, any>): void;
        addEvent(eventName: string, properties?: Record<string, any>): void;
        log(message: string, data?: any): void;
        info(message: string, data?: any): void;
        warn(message: string, data?: any): void;
        error(message: string, data?: any): void;
        debug(message: string, data?: any): void;
        captureException(error: Error, context?: Record<string, any>): void;
        getSessionURL(): string | undefined;
        startNewSession(): void;
        uninstall(): void;
        start(): void;
        threadID(): string;
        recordingID(): string;
        recordingURL(): string;
        reduxEnhancer(): any;
        reduxMiddleware(): any;
        onLogger(callback: Function): void;
        setClock(clock: any): void;
        captureMessage(message: string, level?: string): void;
    }

    const LogRocket: LogRocket;
    export default LogRocket;
}







