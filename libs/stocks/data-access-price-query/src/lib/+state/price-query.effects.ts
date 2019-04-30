import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { StocksAppConfig, StocksAppConfigToken } from '@coding-challenge/stocks/data-access-app-config';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map } from 'rxjs/operators';
import { FetchPriceQuery, PriceQueryActionTypes, PriceQueryFetched, PriceQueryFetchError } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';
import * as moment from 'moment';

@Injectable()
export class PriceQueryEffects {
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
        return this.httpClient
          .get(
            `${this.env.apiURL}/beta/stock/${action.symbol}/chart/max?token=${this.env.apiKey}`
          )
          .pipe(
            map((resp: any[]) => {
              const fromDate = moment(action.fromDate.toLocaleDateString()).toDate();
              const toDate = moment(action.toDate.toLocaleDateString()).toDate();
              return resp.filter(item => {
                const date = moment(item.date).toDate();
                return fromDate <= date && toDate >= date;
              });
            }),
            map(resp => {
              return new PriceQueryFetched(resp as PriceQueryResponse[]);
            })
          );
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient,
    private dataPersistence: DataPersistence<PriceQueryPartialState>
  ) {
  }
}
