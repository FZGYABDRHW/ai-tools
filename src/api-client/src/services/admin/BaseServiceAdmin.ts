import BaseService, { BaseEnvironment } from '../BaseService';

const API_VERSION = 'admin';

export default class BaseServiceAdmin extends BaseService {
    constructor(env: BaseEnvironment = {}) {
        super({ ...env, version: API_VERSION });
    }
}
