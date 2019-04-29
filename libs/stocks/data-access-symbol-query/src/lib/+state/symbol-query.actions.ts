import { Action } from '@ngrx/store';
import { SymbolQueryResponse } from './symbol-query.type';

export enum SymbolQueryActionTypes {
  FetchSymbolQuery = 'symbolQuery.fetch',
  SymbolQueryFetched = 'symbolQuery.fetched',
  SymbolQueryFetchError = 'symbolQuery.error'
}

export class FetchSymbolQuery implements Action {
  readonly type = SymbolQueryActionTypes.FetchSymbolQuery;
  constructor() {}
}

export class SymbolQueryFetchError implements Action {
  readonly type = SymbolQueryActionTypes.SymbolQueryFetchError;
  constructor(public error: any) {}
}

export class SymbolQueryFetched implements Action {
  readonly type = SymbolQueryActionTypes.SymbolQueryFetched;
  constructor(public queryResults: SymbolQueryResponse[]) {}
}

export type SymbolQueryAction =
  | FetchSymbolQuery
  | SymbolQueryFetched
  | SymbolQueryFetchError;
