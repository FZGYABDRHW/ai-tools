import BaseService, { BaseEnvironment } from '../BaseService';

const API_VERSION = 'curator';

export default class BaseServiceCurator extends BaseService {
    constructor(env: BaseEnvironment = {}) {
        super({ ...env, version: API_VERSION });
    }
}
