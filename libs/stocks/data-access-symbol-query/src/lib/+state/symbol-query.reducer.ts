import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SymbolQuery } from './symbol-query.type';
import { transformSymbolQueryResponse } from './symbol-query-transformer.util';
import { SymbolQueryAction, SymbolQueryActionTypes } from './symbol-query.actions';

export const SYMBOLQUERY_FEATURE_KEY = 'symbolyQuery';

export interface SymbolQueryState extends EntityState<SymbolQuery> {
  selectedSymbol: string;
}

export function sortComparer(a: SymbolQuery, b: SymbolQuery): number {
  return a.name.localeCompare(b.name);
}

export const symbolQueryAdapter: EntityAdapter<SymbolQuery> = createEntityAdapter<
  SymbolQuery
>({
  selectId: (symbolQuery: SymbolQuery) => symbolQuery.symbol,
  sortComparer: sortComparer
});

export interface SymbolQueryPartialState {
  readonly [SYMBOLQUERY_FEATURE_KEY]: SymbolQueryState;
}

export const initialState: SymbolQueryState = symbolQueryAdapter.getInitialState({
  selectedSymbol: ''
});

export function symbolQueryReducer(
  state: SymbolQueryState = initialState,
  action: SymbolQueryAction
): SymbolQueryState {
  switch (action.type) {
    case SymbolQueryActionTypes.SymbolQueryFetched: {
      return symbolQueryAdapter.addAll(
        transformSymbolQueryResponse(action.queryResults),
        state
      );
    }
  }
  return state;
}
