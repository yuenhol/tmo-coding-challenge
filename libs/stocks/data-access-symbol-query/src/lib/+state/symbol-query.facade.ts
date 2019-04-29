import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map, skip } from 'rxjs/operators';
import { SymbolQueryPartialState } from './symbol-query.reducer';
import { FetchSymbolQuery } from './symbol-query.actions';
import { getAllSymbolQueries } from './symbol-query.selectors';

@Injectable()
export class SymbolQueryFacade {
  symbolQueries$ = this.store.pipe(
    select(getAllSymbolQueries),
    skip(1),
    map(symbolQueries =>
      symbolQueries.map(symbolQuery => symbolQuery.symbol)
    )
  );

  constructor(private store: Store<SymbolQueryPartialState>) {}

  fetchQuote() {
    this.store.dispatch(new FetchSymbolQuery());
  }
}
