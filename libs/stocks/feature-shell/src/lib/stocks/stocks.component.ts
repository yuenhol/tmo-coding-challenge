import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subscription, timer } from 'rxjs';
import { debounce } from 'rxjs/operators';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
  stockPickerForm: FormGroup;
  fetchQuoteSubscription: Subscription;
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

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
  }

  ngOnInit() {
    this.stockPickerForm = this.fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required]
    });
    this.subscribeValueChanges('symbol', 1000);
    this.subscribeValueChanges('period', 0);
  }

  subscribeValueChanges(controlName: string, debounceTimer: number): void {
    this.fetchQuoteSubscription = this.stockPickerForm.controls[controlName].valueChanges.
    pipe(debounce(() => timer(debounceTimer))).subscribe(() => {
      this.fetchQuote();
    });
  }

  ngOnDestroy(): void {
    if (this.fetchQuoteSubscription) {
      this.fetchQuoteSubscription.unsubscribe();
    }
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, period);
    }
  }
}
