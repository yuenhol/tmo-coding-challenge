import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SYMBOLQUERY_FEATURE_KEY, symbolQueryReducer } from './+state/symbol-query.reducer';
import { SymbolQueryEffects } from './+state/symbol-query.effects';
import { SymbolQueryFacade } from './+state/symbol-query.facade';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(SYMBOLQUERY_FEATURE_KEY, symbolQueryReducer),
    EffectsModule.forFeature([SymbolQueryEffects])
  ],
  providers: [SymbolQueryFacade]
})
export class StocksDataAccessSymbolQueryModule {}
