// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { StocksAppConfig } from '@coding-challenge/stocks/data-access-app-config';

export const environment: StocksAppConfig = {
  production: false,
  apiKey: 'pk_9dccce69545943eba24308655198c24c',
  apiURL: 'https://cloud.iexapis.com'
};
