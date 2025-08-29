import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { EstimateEvents, GetCommentsParams, PostCommentParams } from './interfaces';

export class CommentsService extends BaseService {
    private readonly url: string = `${this.baseUrl}/estimate`;

    public readonly getComments = (
        taskId: number,
        params?: GetCommentsParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<EstimateEvents>>(`${this.url}/${taskId}/comment`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly postComment = (
        taskId: number,
        params: PostCommentParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<Array<null>>>(`${this.url}/${taskId}/comment`, params, options)
            .then(resp => resp.data.response);

    public readonly deleteComment = (
        taskId: number,
        params: { commentId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this.url}/${taskId}/comment`, { params, ...options })
            .then(resp => resp.data.response);
}

export default new CommentsService();
