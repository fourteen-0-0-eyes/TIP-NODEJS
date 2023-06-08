import { createStore, Store } from 'redux';
import { IAction } from '../interfaces/action.interface';
import reducer, { IAppState } from '../reducers/reducer';

export const store: Store<IAppState, IAction> = createStore(reducer);
