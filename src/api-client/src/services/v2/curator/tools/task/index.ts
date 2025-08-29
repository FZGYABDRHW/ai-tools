import BaseService from '../../../BaseServiceV2';
import { BaseResponse } from '../../../../interfaces';
import {
    СhangedCurator,
    HuntersList,
    ChangedCuratorsList,
    TaskInfo,
    CuratorsList,
} from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class ChangeCuratorForTask extends BaseService {
    private url = `${this.baseUrl}/curator/tools/task`;

    async changeTaskInfo(taskId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<TaskInfo>>(
            `${this.url}/${taskId}/edit/change-curator-task-info`,
            options,
        );
        return response;
    }

    async getCuratorsList(taskId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<CuratorsList[]>>(
            `${this.url}/${taskId}/edit/curators/list`,
            options,
        );
        return response;
    }

    async getHuntersList(taskId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<HuntersList[]>>(
            `${this.url}/${taskId}/edit/hunters/list`,
            options,
        );
        return response;
    }

    async changeCurator(taskId: number, curatorId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.put<BaseResponse<СhangedCurator>>(
            `${this.url}/${taskId}/edit/curator`,
            { curatorId },
            options,
        );
        return response;
    }

    async changeHunter(taskId: number, hunterId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.put<BaseResponse<СhangedCurator>>(
            `${this.url}/${taskId}/edit/hunter`,
            { hunterId },
            options,
        );
        return response;
    }

    async changeCuratorsList(limit: number = 20, offset: number = 0, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<ChangedCuratorsList>>(
            `${this.url}/edit/log/change-curator`,
            {
                params: {
                    limit,
                    offset,
                },
                ...options,
            },
        );
        return response;
    }

    async changeSuborganization(
        taskId: number,
        suborganizationId: number,
        departmentId: number,
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.put<BaseResponse<СhangedCurator>>(
            `${this.url}/${taskId}/edit/suborganization`,
            {
                suborganizationId,
                departmentId,
            },
            options,
        );
        return response;
    }
}

export default new ChangeCuratorForTask();
