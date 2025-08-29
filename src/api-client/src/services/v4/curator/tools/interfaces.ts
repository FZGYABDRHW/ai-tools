import { ExecutionAddress } from '../../task/interfaces';
import { Polygon } from '../../../v2/curator/tools/interfaces';

export interface ExecutionAddressInfo extends ExecutionAddress {
    polygon: Polygon;
}
