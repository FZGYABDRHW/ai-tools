import { Arrival, ContractorArrivalDateStatuses } from './interfaces';

const extractStatus = (arrival: Arrival) => arrival.status;

type ArrivalPredicate = (arrival: Arrival) => boolean;

export const isPlanned: ArrivalPredicate = arrival =>
    extractStatus(arrival) === ContractorArrivalDateStatuses.PLANNED;

export const isDone: ArrivalPredicate = arrival =>
    extractStatus(arrival) === ContractorArrivalDateStatuses.DONE;

export const isFailed: ArrivalPredicate = arrival =>
    extractStatus(arrival) === ContractorArrivalDateStatuses.FAILED;

export const isMoved: ArrivalPredicate = arrival =>
    extractStatus(arrival) === ContractorArrivalDateStatuses.MOVED;

export const isCanceled: ArrivalPredicate = arrival =>
    extractStatus(arrival) === ContractorArrivalDateStatuses.CANCELED;
