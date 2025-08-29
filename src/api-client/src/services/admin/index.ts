import BaseService from './BaseServiceAdmin';
import { AxiosRequestConfig } from 'axios';

export enum Response {
    ERROR,
    SUCCESS,
}

interface Polygon {
    geometryJson: number[];
    polygonId: number;
}

export class AdminServices extends BaseService {
    private readonly url: string = `${this.baseUrl}`;

    public readonly savePolygons = async (params: Polygon, options?: AxiosRequestConfig) => {
        const { data } = await this.http.post<number>(`${this.url}/gis/save-polygon`, params);
        return data;
    };
}
