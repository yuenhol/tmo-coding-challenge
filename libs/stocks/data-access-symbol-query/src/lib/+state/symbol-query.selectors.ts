import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SYMBOLQUERY_FEATURE_KEY, symbolQueryAdapter, SymbolQueryState } from './symbol-query.reducer';

const getSymbolQueryState = createFeatureSelector<SymbolQueryState>(
  SYMBOLQUERY_FEATURE_KEY
);

const { selectAll } = symbolQueryAdapter.getSelectors();

export const getAllSymbolQueries = createSelector(
  getSymbolQueryState,
  selectAll
);
