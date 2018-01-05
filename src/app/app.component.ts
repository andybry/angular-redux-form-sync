import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { select, dispatch } from '@angular-redux/store';
import { FormBuilder, Validators } from '@angular/forms';
import { OnInit, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgRedux } from '@angular-redux/store';
import * as R from 'ramda';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  myForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    age: ['', Validators.required]
  });
  @select() myForm$: Observable<{ name: string }>;
  @select() isOn$: Observable<boolean>;
  @dispatch() formChanged = value => ({ type: 'MY_FORM_CHANGE', value });
  @dispatch() turnOn = () => ({ type: 'TURN_ON' });
  @dispatch() turnOff = () => ({ type: 'TURN_OFF' });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const form$ = this.myForm.valueChanges.map(x => ({ val: x, isForm: true }));
    const redux$ = this.myForm$.map(x => ({ val: x, isForm: false }));
    form$
      .debounce(() => Observable.timer(300))
      .merge(redux$)
      .distinctUntilChanged((x, y) => R.equals(x.val, y.val))
      .forEach(
        ({ val, isForm }) =>
          isForm ? this.formChanged(val) : this.myForm.setValue(val)
      );
  }
}
