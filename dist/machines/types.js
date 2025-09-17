"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProfileLoadFailedEvent = exports.isProfileLoadedEvent = exports.isAuthFailureEvent = exports.isAuthSuccessEvent = exports.isServerChangedEvent = exports.isLoginEvent = exports.createInitialAuthContext = void 0;
// Initial context factory
const createInitialAuthContext = () => ({
    authToken: '',
    userId: null,
    user: null,
    selectedServer: 'EU',
    isLoading: false,
    error: null,
    loginCredentials: null,
});
exports.createInitialAuthContext = createInitialAuthContext;
// Helper type guards
const isLoginEvent = (event) => {
    return event.type === 'LOGIN';
};
exports.isLoginEvent = isLoginEvent;
const isServerChangedEvent = (event) => {
    return event.type === 'SERVER_CHANGED';
};
exports.isServerChangedEvent = isServerChangedEvent;
const isAuthSuccessEvent = (event) => {
    return event.type === 'AUTH_SUCCESS';
};
exports.isAuthSuccessEvent = isAuthSuccessEvent;
const isAuthFailureEvent = (event) => {
    return event.type === 'AUTH_FAILURE';
};
exports.isAuthFailureEvent = isAuthFailureEvent;
const isProfileLoadedEvent = (event) => {
    return event.type === 'PROFILE_LOADED';
};
exports.isProfileLoadedEvent = isProfileLoadedEvent;
const isProfileLoadFailedEvent = (event) => {
    return event.type === 'PROFILE_LOAD_FAILED';
};
exports.isProfileLoadFailedEvent = isProfileLoadFailedEvent;
//# sourceMappingURL=types.js.map