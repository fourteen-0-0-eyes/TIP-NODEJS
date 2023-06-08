import { ActionType } from '../enumerations/action-type';
import { IAction } from '../interfaces/action.interface';

export class TestActionCreators {
  public static testApiStart(): IAction {
    return {
      type: ActionType.ApiTestStart,
      payload: null
    };
  }

  public static testApiFinish(message: string): IAction {
    return {
      type: ActionType.ApiTestFinish,
      payload: message
    };
  }

  public static testApiFail(): IAction {
    return {
      type: ActionType.ApiTestFail,
      payload: null
    };
  }
}
