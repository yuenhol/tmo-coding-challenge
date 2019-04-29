import { map, pick } from 'lodash-es';
import { SymbolQuery, SymbolQueryResponse } from './symbol-query.type';

export function transformSymbolQueryResponse(
  response: SymbolQueryResponse[]
): SymbolQuery[] {
  return map(
    response,
    responseItem =>
      ({
        ...pick(responseItem, [
          'symbol',
          'exchange',
          'name',
          'type',
          'iexId',
          'region',
          'isEnabled'

        ]),
      } as SymbolQuery)
  );
}
