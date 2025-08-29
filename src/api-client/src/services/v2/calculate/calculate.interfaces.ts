interface ISiteRegions {
    value: number;
    label: string;
}

interface Region {
    id: number;
    minPrice: number;
    name: string;
    regionalCoefficient: number;
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
    childs: IBaseService[] | IParentService[];
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
}

export { ISiteRegions, IService, IParentService, IBaseService, ISendCompany, Region };

export interface Pricelist {
    tree: Tree[];
    minimal_organization_price: number;
    minimal_performer_price: number;
}

export interface Tree {
    id: number;
    name: string;
    parent_id: number;
    description: string;
    price: number;
    sla: number;
    without_allowance: boolean;
    not_blocking: boolean;
    img_url: string;
    img_id: number;
    root: number;
    has_subcategories: boolean;
    childs: Childs[];
}

export interface Childs {
    id: number;
    name: string;
    parent_id: number;
    description: string;
    price: number;
    sla: number;
    without_allowance: boolean;
    not_blocking: boolean;
    root: number;
    childs: Childs[];
}

// interface Root {
//     id: number
//     name: string
//     img_url: string
//     img_id: number
// }
