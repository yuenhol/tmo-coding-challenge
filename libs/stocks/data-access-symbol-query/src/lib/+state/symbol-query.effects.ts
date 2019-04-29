import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { StocksAppConfig, StocksAppConfigToken } from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { FetchSymbolQuery, SymbolQueryActionTypes, SymbolQueryFetched } from './symbol-query.actions';
import { SymbolQueryResponse } from './symbol-query.type';
import { SymbolQueryPartialState } from './symbol-query.reducer';

@Injectable()
export class SymbolQueryEffects {
  @Effect() loadSymbolQuery$ = this.dataPersistence.fetch(
    SymbolQueryActionTypes.FetchSymbolQuery,
    {
      run: (action: FetchSymbolQuery, state: SymbolQueryPartialState) => {
        return this.httpClient
          .get(
            `${this.env.apiURL}/beta/ref-data/symbols?token=${this.env.apiKey}`
          )
          .pipe(
            map((resp:  SymbolQueryResponse[]) => new SymbolQueryFetched(resp))
          );
      }
    }
  );

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<SymbolQueryPartialState>
  ) {}
}
