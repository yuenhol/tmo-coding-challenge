/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import * as NodeCache from 'node-cache';
import { HttpResponse } from './model/http-response.model';
import { environment } from './environments/environment';

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const nodeCache = new NodeCache({ checkperiod: 0, useClones: false });

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });


  server.route({
      config: {
        cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-with']
        }
      },
      method: 'GET',
      path: '/price/symbol/{symbol}/range/{range}',
      handler: async (request, h) => {
        const { symbol, range } = request.params;
        const url = `${environment.apiURL}/beta/stock/${symbol}/chart/${range}?token=${environment.apiKey}`;
        const cacheKey = getCacheKey(symbol, range);
        let response: HttpResponse = nodeCache.get(cacheKey);
        if (!response) {
          await callEndPoint('GET', url)
            .then(result => {
              response = result;
            })
            .catch(error => {
              response = error;
            });
          nodeCache.set<HttpResponse>(cacheKey, response);
        }
        return h.response(response.content).code(response.status);
      }
    }
  );

  const callEndPoint: (method: string, url: string) => Promise<HttpResponse> = (method: string, url: string) => {
    return new Promise<HttpResponse>(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(new HttpResponse(JSON.parse(xhr.responseText), this.status));
        } else {
          reject(new HttpResponse(xhr.responseText, this.status));
        }
      };
      xhr.onerror = function() {
        reject(new HttpResponse(xhr.responseText, this.status));
      };
      xhr.send();
    });
  };

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

const getCacheKey = (symbol: string, period: string) => `${symbol}-${period}`;

init();
