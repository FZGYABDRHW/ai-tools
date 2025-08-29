interface ISiteRegions {
    value: number;
    label: string;
}

interface ISendCompany {
    name: string;
    phone: number;
}

interface IService {
    tree: IParentService[];
    minimal_organization_price: number;
    minimal_performer_price: number;
}

interface IParentService extends IBaseService {
    childs?: IBaseService[] | IParentService[];
    img_url: string;
    img_id: number;
    has_subcategories: boolean;
}

interface IBaseService {
    id: number;
    name: string;
    parent_id: number;
    description: string;
    price: number;
    sla: number;
    without_allowance: boolean;
    not_blocking: boolean;
    root: number;
    childs?: IBaseService[];
}

export { ISiteRegions, IService, IParentService, IBaseService, ISendCompany };
