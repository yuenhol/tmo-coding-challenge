import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  minDate: Date;

  quotes$ = this.priceQuery.priceQueries$;

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.minDate = new Date();
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, fromDate, toDate);
    }
  }

  fromDateEvent(event: MatDatepickerInputEvent<Date>): void {
    if (!this.stockPickerForm.controls['fromDate'].invalid && !this.stockPickerForm.controls['toDate'].invalid) {
        const fromDate = event.value;
        const toDate = new Date(this.stockPickerForm.controls['toDate'].value);
        if (fromDate > toDate) {
          this.stockPickerForm.controls['fromDate'].setValue(toDate);
        }
    }
  }

  toDateEvent(event: MatDatepickerInputEvent<Date>): void {
    if (!this.stockPickerForm.controls['fromDate'].invalid && !this.stockPickerForm.controls['toDate'].invalid) {
      const toDate = event.value;
      const fromDate = new Date(this.stockPickerForm.controls['fromDate'].value);
      if (fromDate > toDate) {
        this.stockPickerForm.controls['toDate'].setValue(fromDate);
      }
    }
  }




}
