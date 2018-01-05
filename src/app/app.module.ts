import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgReduxModule,
  NgRedux,
  DevToolsExtension
} from '@angular-redux/store';
import { AnyAction, Reducer, combineReducers } from 'redux';
import { AppComponent } from './app.component';
import * as R from 'ramda';

interface IAppState {
  isOn: boolean;
  myForm: {
    name: string;
    age: string;
  };
}

const isOn: Reducer<boolean> = (state = false, action) => {
  switch (action.type) {
    case 'TURN_ON':
      return true;
    case 'TURN_OFF':
      return false;
    default:
      return state;
  }
};

const myForm: Reducer<any> = (state = { name: '', age: '' }, action) => {
  switch (action.type) {
    case 'MY_FORM_CHANGE':
      return R.equals(state, action.value) ? state : action.value;
    default:
      return state;
  }
};

const reducer: Reducer<IAppState> = combineReducers({ isOn, myForm });

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgReduxModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private devTools: DevToolsExtension
  ) {
    ngRedux.configureStore(
      reducer,
      {
        isOn: false,
        myForm: {
          name: '',
          age: ''
        }
      },
      [],
      devTools.isEnabled() ? [devTools.enhancer()] : []
    );
  }
}
