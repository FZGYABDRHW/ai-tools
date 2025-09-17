import { Context, Effect, Stream } from 'effect';
import { TaskListParameters, ParameterExtractionService } from '../../parameterExtractionService';
import { buildServiceInitializer } from '../../../serviceInit';
import { CuratorListService } from '../../../api-client/src/services/v2/curator/task/index';

export interface TaskSourceService {
  readonly stream: (args: { authToken: string; server: 'EU' | 'RU'; startOffset: number; parameters?: TaskListParameters; }) => Stream.Stream<number, Error>;
}

export const TaskSourceServiceTag = Context.GenericTag<TaskSourceService>('TaskSourceService');

export const makeTaskSourceService = (): TaskSourceService => ({
  stream: ({ authToken, server, startOffset, parameters }) => {
    const si = buildServiceInitializer(authToken, server);
    const service = si(CuratorListService);

    const defaultLimit = 30;
    const limit = parameters?.limit || defaultLimit;
    const method = (parameters?.taskStatus && ParameterExtractionService.getServiceMethod(parameters.taskStatus)) || 'getInWorkTasks';

    const baseParams: any = {
      limit,
      offset: startOffset
    };
    if (parameters?.timeRangeFrom) baseParams.timeRangeFrom = parameters.timeRangeFrom;
    if (parameters?.timeRangeTo) baseParams.timeRangeTo = parameters.timeRangeTo;

    // Diagnostics
    // eslint-disable-next-line no-console
    console.log('[TaskSource] start', { method, limit, startOffset, query: baseParams });

    if (typeof service[method] !== 'function') {
      // eslint-disable-next-line no-console
      console.error('[TaskSource] Invalid method', method);
      return Stream.fromIterable<number>([]);
    }

    return Stream.paginateEffect(baseParams as any, (query) =>
      Effect.tryPromise({
        try: async () => {
          const tasks = await service[method](query);
          // eslint-disable-next-line no-console
          console.log('[TaskSource] page', { size: tasks?.length || 0, offset: query.offset });
          const next = tasks.length < limit ? undefined : { ...query, offset: (query.offset ?? 0) + limit };
          const ids = tasks.map((t: any) => t.id as number);
          return [[...ids], next] as const;
        },
        catch: (e) => {
          // eslint-disable-next-line no-console
          console.error('[TaskSource] error', e);
          return e as Error;
        }
      })
    ).pipe(Stream.flattenIterables);
  }
});
