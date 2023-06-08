import { ActionType } from '../enumerations/action-type';
import { IAction } from '../interfaces/action.interface';
import TestService from '../services/test.service';
import { store } from '../store';
import { TestActionCreators } from '../utilities/test-action.creators';

export interface IAppState {
  isLoading: boolean;
  testMessage: string;
}

const defaultState: IAppState = {
  isLoading: false,
  testMessage: null
};

const reducer = (state: IAppState = defaultState, action: IAction): IAppState => {

  // TODO: this is naive handling of async action
  const dispatchFinish = (message: string): void => {
    store.dispatch(TestActionCreators.testApiFinish(message));
  };

  const dispatchFail = (): void => {
    store.dispatch(TestActionCreators.testApiFail());
  };

  switch (action.type) {
    case ActionType.ApiTestStart:
      TestService.testApi().then(dispatchFinish).catch(dispatchFail);

      return {
        ...state,
        testMessage: null,
        isLoading: true
      };

    case ActionType.ApiTestFinish:
      return {
        ...state,
        testMessage: action.payload,
        isLoading: false
      };

    case ActionType.ApiTestFail:

      return {
        ...state,
        testMessage: null,
        isLoading: false
      };

      default: return {
      ...state
    };
  }
};

export default reducer;
