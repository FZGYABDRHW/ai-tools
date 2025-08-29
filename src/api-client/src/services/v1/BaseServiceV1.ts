import BaseService, { BaseEnvironment } from '../BaseService';

const API_VERSION = 'v1';

export default class BaseServiceV4 extends BaseService {
    constructor(env: BaseEnvironment = {}) {
        super({ ...env, version: API_VERSION });
    }
}
