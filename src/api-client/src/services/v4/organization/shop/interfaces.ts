import { WorkTime } from '../../../v2/curator/tools/shop/interfaces';

export interface Shop {
    id: number;
    name: string;
    description: string;
    organizationId: number;
    suborganizationId: number;
    schedule: WorkTime;
    address: {
        name: string;
        original: string;
        short: string;
        point: number[];
    };
    contacts: {
        name: string;
        phone: string;
        phoneAdditional: string;
        email: string;
    };
    isDeleted: boolean;
    onBigCity: boolean;
    assessRating: boolean;
    needQuestionnaire: boolean;
    branchId: number;
}
