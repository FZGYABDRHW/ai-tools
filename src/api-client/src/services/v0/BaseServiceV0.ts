import BaseService, { BaseEnvironment } from '../BaseService';

export default class BaseServiceV0 extends BaseService {
    constructor(env: BaseEnvironment = {}) {
        super({ ...env });
    }
}
