import React, {ChangeEvent, Component, ReactComponentElement, useState} from 'react';
import AxiosError, {AxiosResponse} from 'axios';
import Helmet from 'react-helmet'
import { Navigate } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import { Header } from '../Header';
import { ActionCreator, ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { IAction } from '../../interfaces/action.interface';
import { IAppState } from '../../reducers/reducer';
import { TestActionCreators } from '../../utilities/test-action.creators';
import UserService from '../../services/user.service';


interface IMainProps {
  isLoading: boolean;
  message: string;
  dispatchApiTestStart?: ActionCreator<IAction>;
}

type State = {
    email: string
    password: string
    error: string
    loginRedirect: boolean
};

class LoginForm extends Component<IMainProps, State> {
    public constructor(props: IMainProps) {
        super(props);
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.login = this.login.bind(this)

        this.state = {
            email: undefined,
            password: undefined,
            error: undefined,
            loginRedirect: false
        };
    };

    public onChangeUsername(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            email: e.target.value
        });
    }

    public onChangePassword(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            password: e.target.value
        });
    }

    public login() {
        UserService.login(this.state.email, this.state.password)
            .then((response) => {
                if (response.username){
                    this.setState({
                        loginRedirect: true
                    });
                }
            })
            .catch((e) => {
                let errMsg = 'Неизвестная ошибка'
                if (e.response) {
                    if (e.response.status === 400) {
                        errMsg = 'Неверный логин или пароль'
                    }
                }
                else {
                    if (e.message === 'Network Error'){
                        errMsg = 'Нет соединения с сервером'
                    }
                }
                this.setState({
                    error: errMsg
                });
            });
    }

    public onPingClick = () => {
    this.props.dispatchApiTestStart();
    }

    public render(): JSX.Element {
      const { email, password } = this.state;
      // @ts-ignore
      return (
          <div className="container">
              <Helmet>
                  <meta charSet="utf-8" />
                  <title>Авторизация - Могилевоблгаз</title>
              </Helmet>
              <Header />
              { this.state.loginRedirect ? (<Navigate to="/"/>) : null }
              <div className="block-heading">
                  <h2 className="text">Войти</h2>
                  <p>&nbsp; &nbsp;&nbsp;</p>
              </div>
              <form
                  className="login form-group"
                  style={{ borderWidth: 0, borderRadius: 40 }}
              >
                  <div className="mb-3">
                      <p>
                          Если у вас ещё нет учётной записи, пожалуйста, сначала <a href="/signup">зарегистрируйтесь</a>.
                      </p>
                      <p>
                          <label
                              className="form-label"
                              htmlFor="id_login">Почта:
                          </label>
                          <input
                              className="form-control"
                              type="username"
                              onChange={this.onChangeUsername}
                              name="email"
                              placeholder="Почта"
                              autoComplete="username"
                              maxLength={150}
                              required={true}
                              id="id_login"
                          />
                      </p>
                      <p>
                          <label
                              className="form-label"
                              htmlFor="id_password">Пароль:
                          </label>
                          <input
                              className="form-control"
                              type="password"
                              name="password"
                              placeholder="Пароль"
                              autoComplete="current-password"
                              required={true}
                              onChange={this.onChangePassword}
                              id="id_password"
                          />
                      </p>
                      <p>
                          <input className="form-check-input" type="checkbox" id="id_remember" />
                          <label className="form-check" style={{display: 'inline', paddingLeft: '0.5rem'}} htmlFor="id_remember">Запомнить меня</label>
                      </p>
                  </div>
                  <div className="row">
                      <div className="col-9">
                          <a
                              className="button secondaryAction"
                              href="password/reset/"
                          >
                              Забыли пароль?
                          </a>
                      </div>
                      <div className="col text-end m-auto">
                          <input
                              type="button"
                              className="btn btn-primary primaryAction"
                              onClick={this.login}
                              value="Войти"
                          />
                      </div>
                  </div>
                  {this.state.error ? <label className="text-danger">{ this.state.error }</label> : null}
              </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
