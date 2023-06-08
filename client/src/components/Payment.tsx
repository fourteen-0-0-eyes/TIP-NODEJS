import React, {ChangeEvent, Component} from 'react';
import Helmet from 'react-helmet'
import { Header } from './Header';
import { Footer } from './Footer';
import {requireAuth, requireCart} from '../utilities/url-utils';
import ContractService from '../services/contract.service';
import {Navigate} from 'react-router-dom';
// @ts-ignore
import Pdf from '../contracts/gas.pdf';

type State = {
    owner: string
    month: string
    year: string
    cardNumber: string
    cvc: string
    contractCheck: boolean
    personalCheck: boolean

    redirect: boolean
    error: string
}
class Payment extends Component<any, State> {
    public constructor(props: any) {
        super(props);

        this.state = {
            redirect: false,
            error: undefined,

            owner: undefined,
            month: undefined,
            year: undefined,
            cardNumber: undefined,
            cvc: undefined,
            contractCheck: false,
            personalCheck: false
        }
        this.buy = this.buy.bind(this)
        this.onChangeOwner = this.onChangeOwner.bind(this)
        this.onChangeMonth = this.onChangeMonth.bind(this)
        this.onChangeYear = this.onChangeYear.bind(this)
        this.onChangeCardNumber = this.onChangeCardNumber.bind(this)
        this.onChangeCVC = this.onChangeCVC.bind(this)
        this.onChangeContractCheck = this.onChangeContractCheck.bind(this)
        this.onChangePersonalCheck = this.onChangePersonalCheck.bind(this)
    };
    public onChangeOwner(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            owner: e.target.value
        });
    }

    public onChangeMonth(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            month: e.target.value
        });
    }
    public onChangeYear(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            year: e.target.value
        });
    }
    public onChangeCardNumber(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            cardNumber: e.target.value
        });
    }
    public onChangeCVC(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            cvc: e.target.value
        });
    }
    public onChangeContractCheck(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            contractCheck: e.target.checked
        });
    }
    public onChangePersonalCheck(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            personalCheck: e.target.checked
        });
    }
    public buy() {
        this.setState({
            error: undefined
        });

        if (!this.state.owner || isNaN(Number(this.state.month)) || isNaN(Number(this.state.month))
            || isNaN(Number(this.state.cvc)) || isNaN(Number(this.state.cardNumber))){
            this.setState({
                error: 'Некорректные данные карты'
            });
            return;
        }

        if (!this.state.contractCheck || !this.state.personalCheck){
            this.setState({
                error: 'Необходимо согласие с условиями сервиса'
            });
            return;
        }

        ContractService.create(localStorage.getItem('cartNumber'), localStorage.getItem('userid'))
            .then((response) => {
                if (response.contract) {
                    this.setState({
                        redirect: true
                    });
                }
                else {
                    this.setState({
                        error: 'Проверьте корректность действий и наличие адреса в профиле'
                    });
                }
            }).catch((e) => {
            let errMsg = 'Неизвестная ошибка'
            // tslint:disable-next-line:no-empty
            if (e.response) {

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
    public product(): any {
      switch (localStorage.getItem('cartNumber')) {
          case '1': return {
              name: 'Тариф «Стандартный»',
              description: 'Пакет снабжения газом и технического обслуживания ' +
                  'газоиспользующего оборудования',
              price: '389 BYN'
          }
          case '2': return {
              name: 'Тариф «Расширенный»',
              description: 'Пакет снабжения газом и технического обслуживания ' +
                  'газоиспользующего оборудования',
              price: '959 BYN'
          }
          case '3': return {
              name: 'Тариф «Максимальный»',
              description: 'Пакет снабжения газом и технического обслуживания ' +
                  'газоиспользующего оборудования',
              price: '2300 BYN'
          }

          default: return {
              name: 'Тариф «Расширенный»',
              description: 'Пакет снабжения газом и технического обслуживания ' +
                  'газоиспользующего оборудования',
              price: '959 BYN'
          }
      }
    }
    public render(): JSX.Element {
    return (
      <div className="app-container">
          <Helmet>
              <meta charSet="utf-8" />
              <title>Итог - Могилевоблгаз</title>
          </Helmet>
          <Header/>
          { this.state.redirect ? (<Navigate to="/profile"/>) : null }
          {requireCart()}
          {requireAuth(true)}
          <main className="page payment-page">
              <section className="clean-block payment-form dark">
                  <div className="container">
                      <div className="block-heading">
                          <h2 className="text-info">Оформление услуг</h2>
                          <p>Подтвердите информацию ниже</p>
                      </div>
                      <form>
                          <div className="products">
                              <h3 className="title">Услуги</h3>
                              <div className="item">
            <span className="price">
              <strong>{this.product().price}</strong>
            </span>
                                  <p className="item-name">
                                      <strong>
                                          {this.product().description}
                                      </strong>
                                      <br />
                                  </p>
                                  <p className="item-description">{this.product().name}</p>
                              </div>
                              <div className="item" />
                              <div className="total">
                                  <span>Итого</span>
                                  <span className="price">
              <strong>{this.product().price}</strong>
            </span>
                              </div>
                          </div>
                          <div className="card-details">
                              <h3 className="title">Способ оплаты: банковская карточка</h3>
                              <div className="row">
                                  <div className="col-sm-7">
                                      <div className="mb-3">
                                          <label className="form-label" htmlFor="card_holder">
                                              Владелец
                                          </label>
                                          <input
                                              className="form-control"
                                              type="text"
                                              id="card_holder"
                                              placeholder="Владелец"
                                              name="card_holder"
                                              onChange={this.onChangeOwner}
                                          />
                                      </div>
                                  </div>
                                  <div className="col-sm-5">
                                      <div className="mb-3">
                                          <label className="form-label">срок истекает</label>
                                          <div className="input-group expiration-date">
                                              <input
                                                  className="form-control"
                                                  type="text"
                                                  placeholder="ММ"
                                                  name="expiration_month"
                                                  maxLength={2}
                                                  onChange={this.onChangeMonth}
                                              />
                                              <input
                                                  className="form-control"
                                                  type="text"
                                                  placeholder="ГГ"
                                                  name="expiration_year"
                                                  maxLength={2}
                                                  onChange={this.onChangeYear}
                                              />
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-sm-8">
                                      <div className="mb-3">
                                          <label className="form-label" htmlFor="card_number">
                                              номер
                                          </label>
                                          <input
                                              className="form-control"
                                              type="text"
                                              id="card_number"
                                              placeholder="Номер"
                                              name="card_number"
                                              onChange={this.onChangeCardNumber}
                                              maxLength={16}
                                          />
                                      </div>
                                  </div>
                                  <div className="col-sm-4">
                                      <div className="mb-3">
                                          <label className="form-label" htmlFor="cvc">
                                              CVC
                                          </label>
                                          <input
                                              className="form-control"
                                              type="text"
                                              id="cvc"
                                              placeholder="CVC"
                                              name="cvc"
                                              onChange={this.onChangeCVC}
                                              maxLength={3}
                                          />
                                      </div>
                                  </div>
                                  <div className="col-sm-12">
                                      <div>
                                          <div className="form-check">
                                              <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  id="formCheck-1"
                                                  required={true}
                                                  onChange={this.onChangeContractCheck}
                                              />
                                              <label className="form-check-label" htmlFor="formCheck-1">
                                                  Я ознакомлен с положениями&nbsp;
                                                  <a href={Pdf}>договора об оказании услуг</a>
                                              </label>
                                          </div>
                                      </div>
                                      <div>
                                          <div className="form-check">
                                              <input
                                                  className="form-check-input"
                                                  type="checkbox"
                                                  id="formCheck-2"
                                                  required={true}
                                                  onChange={this.onChangePersonalCheck}
                                              />
                                              <label className="form-check-label" htmlFor="formCheck-2">
                                                  я СОГЛАСЕН НА ОБРАБОТКУ ПЕРСОНАЛЬНОЙ ИНФОРМАЦИИ
                                              </label>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-sm-12">
                                      <div className="mb-3">
                                          <input className="btn btn-primary d-block w-100"
                                                 type="button"
                                                 value="Подтвердить"
                                                 onClick={this.buy}
                                          />
                                      </div>
                                  </div>
                                  {this.state.error ? <label className="text-danger">{ this.state.error }</label> : null}
                              </div>
                          </div>
                      </form>
                  </div>
              </section>
          </main>
          <Footer/>
      </div>
    );
  }
}

export default Payment;
