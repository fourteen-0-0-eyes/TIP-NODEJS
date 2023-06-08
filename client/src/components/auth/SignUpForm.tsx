import React, {ChangeEvent, Component} from 'react';
import Helmet from 'react-helmet'
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
    username: string
    password: string
    confirmPassword: string
    email: string

    error: string
    info: string
    redirect: boolean
};


class SignUpForm extends Component<IMainProps, State> {
    public constructor(props: IMainProps) {
        super(props);
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangeEmail = this.onChangeEmail.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
        this.register = this.register.bind(this)

        this.state = {
            username: undefined,
            password: undefined,
            confirmPassword: undefined,
            email: undefined,

            info: undefined,
            error: undefined,
            redirect: false
        };
    };

    public onChangeUsername(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            username: e.target.value
        });
    }

    public onChangePassword(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            password: e.target.value
        });
    }

    public onChangeConfirmPassword(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            confirmPassword: e.target.value
        });
    }

    public onChangeEmail(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            email: e.target.value
        });
    }

    public register() {
        if (!(this.state.username && this.state.password && this.state.confirmPassword && this.state.email))
        {
            this.setState({
                error: 'Заполните все поля'
            });
            return;
        }
        this.setState({
            info: undefined,
            error: undefined
        });
        UserService.register(this.state.username, this.state.password, this.state.confirmPassword, this.state.email)
            .then((response) => {
                if (response.verified){
                    this.setState({
                        redirect: true
                    });
                }
                else {
                    this.setState({
                        info: 'Письмо с подтверждением отправлено на email'
                    });
                }
            })
            .catch((e) => {
                let errMsg = 'Неизвестная ошибка'
                if (e.response) {
                    if (e.response.status === 400) {
                        errMsg = e.response.data.message
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

    public render(): JSX.Element {
      return (
          <div className="container">
              <Helmet>
                  <meta charSet="utf-8" />
                  <title>Регистрация - Могилевоблгаз</title>
              </Helmet>
              <Header />
              <div className="block-heading">
                  <h2 className="text">Регистрация</h2>
                  <p>&nbsp; &nbsp;&nbsp;</p>
              </div>
              <form
                  className="signup form-group"
                  style={{ borderWidth: 0, borderRadius: 40 }}
              >
                  <div className="mb-3">
                      <p>
                          Уже зарегистрированы? <a href="/login">Войдите</a>.
                      </p>
                      <p>
                          <label
                              className="form-label"
                              htmlFor="id_username">Имя пользователя:
                          </label>
                          <input
                              className="form-control"
                              type="text"
                              name="username"
                              placeholder="Имя пользователя"
                              autoComplete="username"
                              maxLength={150}
                              required={true}
                              onChange={this.onChangeUsername}
                              id="id_username"
                          />
                      </p>
                      <p>
                          <label
                              className="form-label"
                              htmlFor="id_email">E-mail:
                          </label>
                          <input
                              className="form-control"
                              type="email"
                              name="email"
                              placeholder="E-mail адрес"
                              autoComplete="email"
                              required={true}
                              onChange={this.onChangeEmail}
                              id="id_email"
                          />
                      </p>
                      <p>
                          <label
                              className="form-label"
                              htmlFor="id_password1">Пароль:
                          </label>
                          <input
                              className="form-control"
                              type="password"
                              name="password1"
                              placeholder="Пароль"
                              autoComplete="new-password"
                              required={true}
                              onChange={this.onChangePassword}
                              id="id_password1"
                          />
                      </p>
                      <p>
                          <label
                              className="form-label"
                              htmlFor="id_password2">Пароль (еще раз):
                          </label>
                          <input
                              className="form-control"
                              type="password"
                              name="password2"
                              placeholder="Пароль (еще раз)"
                              required={true}
                              onChange={this.onChangeConfirmPassword}
                              id="id_password2"
                          />
                      </p>
                      <div className="row">
                          <div className="col-9" />
                          <div className="col text-end m-auto">
                              <input
                                  className="btn btn-primary primaryAction"
                                  type="button"
                                  value="Регистрация"
                                  onClick={this.register}
                              />
                          </div>
                      </div>
                  </div>
                  {this.state.info ? <label className="text-info">{ this.state.info }</label> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
