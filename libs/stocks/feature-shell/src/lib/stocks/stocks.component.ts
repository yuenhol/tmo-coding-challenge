import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SymbolQueryFacade } from '@coding-challenge/stocks/data-access-symbol-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;

  quotes$ = this.priceQuery.priceQueries$;
  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  static validateSymbol(controlValue: string, validSymblos: string[]): { [key: string]: boolean } | null {
    if (!controlValue) {
      return { required: true };
    } else if (validSymblos.find(symbol => symbol === controlValue)) {
      return null;
    }
    return { invalidValue: true };
  }

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade, private symbolQuery: SymbolQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, [], this.validateSymbol(this.symbolQuery.symbolQueries$)],
      period: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.symbolQuery.fetchQuote();
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period);
    }
  }

  validateSymbol(validSymbolsObservable: Observable<string[]>): AsyncValidatorFn {
    let validSymbols: string[] = null;
    return (control: AbstractControl): Observable<{ [key: string]: boolean } | null> => {
      if (validSymbols) {
        return of(StocksComponent.validateSymbol(control.value, validSymbols));
      }
      return validSymbolsObservable.pipe(take(1), map(symbols => {
        validSymbols = symbols;
        return StocksComponent.validateSymbol(control.value, validSymbols);
      }));
    };
  }

  getSymbolErrorMessage(): string {
    const formControl = this.stockPickerForm.get('symbol');
    if (!formControl.valid) {
      if (formControl.hasError('required')) {
        return 'Please enter a symbol';
      } else if (formControl.hasError('invalidValue')) {
        return `${formControl.value} is not a valid symbol.  Please enter valid symbol`;
      }
    }


  }


}
