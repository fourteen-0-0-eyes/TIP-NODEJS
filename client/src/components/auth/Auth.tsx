import React, { Component } from 'react';
import Helmet from 'react-helmet'
import { connect, MapStateToProps } from 'react-redux';
import { Header } from '../Header';
import { ActionCreator, ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { IAction } from '../../interfaces/action.interface';
import { IAppState } from '../../reducers/reducer';
import { TestActionCreators } from '../../utilities/test-action.creators';
import LoginForm from './LoginForm';
import {getPath, requireAuth} from '../../utilities/url-utils'
import SignUpForm from './SignUpForm';


interface IMainProps {
  isLoading: boolean;
  message: string;
  dispatchApiTestStart?: ActionCreator<IAction>;
}

class Auth extends Component<IMainProps> {

  public onPingClick = () => {
    this.props.dispatchApiTestStart();
  }

  public render(): JSX.Element {
      const authForm = () => {
          switch (getPath()) {

              case '/login':   return <LoginForm />;
              case '/signup':   return <SignUpForm />;

              default:      return <h1>Страница не найдена</h1>
          }
      }
      return (
      <div className="app-container">
          {requireAuth(false)}
          <Header />
          <main className="page landing-page">
              <section
                  className="clean-block clean-form dark"
                  style={{ background: 'rgba(246,246,246,0)' }}
              >
                  { authForm() }
              </section>
          </main>
      </div>
    );
  }
}

const mapStateToProps: MapStateToProps<IMainProps, any, IAppState> = (state: IAppState): IMainProps => {
  return {
    isLoading: state.isLoading,
    message: state.testMessage
  };
};

const mapDispatchToProps = (dispatch: any): ActionCreatorsMapObject<IAction> => {
  return bindActionCreators<IAction, ActionCreatorsMapObject<IAction>>(
    {
      dispatchApiTestStart: TestActionCreators.testApiStart
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
