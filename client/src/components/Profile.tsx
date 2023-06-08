import React, {ChangeEvent, Component} from 'react';
import Helmet from 'react-helmet'
import { Header } from './Header';
import { Footer } from './Footer';
import UserService from '../services/user.service';
import {ActionCreator} from 'redux';
import {IAction} from '../interfaces/action.interface';
import {requireAuth} from '../utilities/url-utils';
import ContractService from '../services/contract.service';
// @ts-ignore
import Pdf from '../contracts/gas.pdf';

type State = {
    firstname: string
    lastname: string
    idNumber: string
    address: string
    info: string
    error: string
    loginRedirect: boolean
    contracts: any
    contractsInfo: any
    dataLoaded: boolean
};

class Profile extends Component<any, State> {
    public constructor(props: any) {
        super(props);
        this.onChangeFirstname = this.onChangeFirstname.bind(this)
        this.onChangeLastname = this.onChangeLastname.bind(this)
        this.onChangeIdNumber = this.onChangeIdNumber.bind(this)
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.logout = this.logout.bind(this)
        this.getProfile = this.getProfile.bind(this)
        this.getContracts = this.getContracts.bind(this)
        this.getContractsInfo = this.getContractsInfo.bind(this)
        this.updateProfile = this.updateProfile.bind(this)
        this.renderContracts = this.renderContracts.bind(this)
        this.renewalContract = this.renewalContract.bind(this)

        this.state = {
            firstname: undefined,
            lastname: undefined,
            idNumber: undefined,
            address: undefined,

            info: undefined,
            error: undefined,
            loginRedirect: false,
            contracts: undefined,
            contractsInfo: undefined,
            dataLoaded: false
        };
    };


    public componentDidMount() {
        this.getProfile()
        this.getContracts()
        this.getContractsInfo()
        this.setState({
            dataLoaded: true
        });
    }

    public onChangeFirstname(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            firstname: e.target.value
        });
    }

    public onChangeLastname(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            lastname: e.target.value
        });
    }

    public onChangeIdNumber(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            idNumber: e.target.value
        });
    }

    public onChangeAddress(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            address: e.target.value
        });
    }

    public logout() {
        UserService.logout();
        this.setState({
            loginRedirect: true
        });
    }
    public renewalContract(id: string) {
        this.setState({
            info: undefined,
            error: undefined
        });
        ContractService.updateTime(id).then((response) => {
            this.setState({
                info: 'Контракт успешно продлен на год'
            });
        }).catch((e) => this.catchResponseError(e));
    }

    public updateProfile() {
        this.setState({
            info: undefined,
            error: undefined
        });

        if (isNaN(Number(this.state.idNumber))){
            this.setState({
                error: 'Идентификатор содержит недопустимые символы'
            });
            return;
        }

        UserService.updateUser(this.state.firstname, this.state.lastname, this.state.address, this.state.idNumber)
            .then((response) => {
                if (response.username) {
                    this.setState({
                        info: 'Профиль успешно обновлен'
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

    public renderContracts() : any {
        if (!this.state.contracts || !this.state.contractsInfo){
            return null;
        }

        const content = [];
        for (const contract of this.state.contracts) {
            let contractInfo
            switch (contract.contractId) {
                case 1: contractInfo = this.state.contractsInfo[1]; break;
                case 2: contractInfo = this.state.contractsInfo[2]; break;
                case 3: contractInfo = this.state.contractsInfo[3]; break;
            }
            if (!contractInfo || !contractInfo.description){
                return null;
            }

            content.push(
                <div
                    className="row rounded-2 p-3 my-2"
                    style={{
                        boxShadow: '0.15rem 0.15rem .4rem rgba(0,0,0,.3)'
                    }}
                >
                    <div className="col-8">
                          <span className="text">
                            <strong>{contractInfo.description}</strong> - {contractInfo.longDescription}
                          </span>
                    </div>
                    <div className="col-2">
                        <span className="price">до {contract.updatedAt.split('T')[0]}</span>
                    </div>
                    <div className="col-2 d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-primary icon-refresh"
                            type="button"
                            style={{ padding: 0, margin: 0, height: 30, width: 30, fontFamily: 'simple-line-icons' }}
                            onClick={e => this.renewalContract(contract.id)}
                        />
                        <span>&nbsp;</span>
                        <a href={Pdf}>
                            <button
                                className="btn btn-secondary icon-docs"
                                type="button"
                                style={{ padding: 0, margin: 0, height: 30, width: 30, fontFamily: 'simple-line-icons' }}
                            />
                        </a>
                    </div>
                </div>
            );
        }
        return (content);
    }

    public getContracts() {
        UserService.getUserContracts()
            .then((response) => {
                this.setState({
                    contracts: response
                });
            })
            .catch((e) => {
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

    public catchResponseError(e: any) {
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
    }

    public getContractsInfo() {
        const contracts: { [id: number] : any; } = {}
        UserService.getContractInfo(1)
            .then((response) => {
                contracts[1] = response
            })
            .catch((e) => this.catchResponseError(e));

        UserService.getContractInfo(2)
            .then((response) => {
                contracts[2] = response
            })
            .catch((e) => this.catchResponseError(e));

        UserService.getContractInfo(3)
            .then((response) => {
                contracts[3] = response
            })
            .catch((e) => this.catchResponseError(e));

        this.setState({
            contractsInfo: contracts
        });
    }

    public getProfile() {
        UserService.getUserCredentials()
            .then((response) => {
                this.setState({
                    firstname: response.firstname,
                    lastname: response.lastname,
                    idNumber: response.idNumber,
                    address: response.address
                });
            })
            .catch((e) => {
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
    public render(): JSX.Element {
    return (
      <div className="app-container">
          {requireAuth(true)}
          <Helmet>
              <meta charSet="utf-8" />
              <title>Профиль - Могилевоблгаз</title>
          </Helmet>
          <Header/>
          <main className="page shopping-cart-page">
              <section className="clean-block clean-cart dark">
                  <div className="container">
                      <div className="p-4">
                          <div className="row">
                              <div className="col-11">
                                  <h2 className="text-info">Профиль</h2>
                              </div>
                              <div className="col-1">
                                  <input
                                      type="button"
                                      className="btn btn-primary primaryAction"
                                      onClick={this.logout}
                                      value="Выйти"
                                  />
                              </div>
                          </div>
                      </div>
                      <div className="content">
                          <div className="row g-0">
                              <div className="col-md-12 col-lg-5">
                                  <div className="p-1">
                                      <div className="product">
                                          <div className="row justify-content-start align-items-start">
                                              <div className="col">
                                                  <section className="p-2">
                                                      <div className="container">
                                                          <div
                                                              className="bg-light border rounded border-0 border-light d-flex flex-column justify-content-between align-items-center flex-lg-row"
                                                              style={{ background: 'initial !important' }}
                                                          >
                                                              <div className="text-center mx-3 text-lg-start py-3 py-lg-1">
                                                                  <h5>Имя</h5>
                                                              </div>
                                                              <form
                                                                  className="d-flex justify-content-center flex-wrap my-2"
                                                                  method="post"
                                                              >
                                                                  <div className="my-2 mx-2">
                                                                      <input
                                                                          className="form-control"
                                                                          type="email"
                                                                          placeholder="Имя"
                                                                          onChange={this.onChangeFirstname}
                                                                          value={this.state.firstname}
                                                                      />
                                                                  </div>
                                                              </form>
                                                          </div>
                                                      </div>
                                                  </section>
                                              </div>
                                          </div>
                                          <div className="row justify-content-start align-items-start">
                                              <div className="col">
                                                  <section className="p-2">
                                                      <div className="container">
                                                          <div
                                                              className="bg-light border rounded border-0 border-light d-flex flex-column justify-content-between align-items-center flex-lg-row"
                                                              style={{ background: 'initial !important' }}
                                                          >
                                                              <div className="text-center mx-3 text-lg-start py-3 py-lg-1">
                                                                  <h5>Фамилия</h5>
                                                              </div>
                                                              <form
                                                                  className="d-flex justify-content-center flex-wrap my-2"
                                                                  method="post"
                                                              >
                                                                  <div className="my-2 mx-2">
                                                                      <input
                                                                          className="form-control"
                                                                          type="email"
                                                                          placeholder="Фамилия"
                                                                          onChange={this.onChangeLastname}
                                                                          value={this.state.lastname}
                                                                      />
                                                                  </div>
                                                              </form>
                                                          </div>
                                                      </div>
                                                  </section>
                                              </div>
                                          </div>
                                          <div className="row justify-content-start align-items-start">
                                              <div className="col">
                                                  <section className="p-2">
                                                      <div className="container">
                                                          <div
                                                              className="bg-light border rounded border-0 border-light d-flex flex-column justify-content-between align-items-center flex-lg-row"
                                                              style={{ background: 'initial !important' }}
                                                          >
                                                              <div className="text-center mx-3 text-lg-start py-3 py-lg-1">
                                                                  <h5>Адрес</h5>
                                                              </div>
                                                              <form
                                                                  className="d-flex justify-content-center flex-wrap my-2"
                                                                  method="post"
                                                              >
                                                                  <div className="my-2 mx-2">
                                                                      <input
                                                                          className="form-control"
                                                                          type="email"
                                                                          placeholder="Адрес"
                                                                          onChange={this.onChangeAddress}
                                                                          value={this.state.address}
                                                                      />
                                                                  </div>
                                                              </form>
                                                          </div>
                                                      </div>
                                                  </section>
                                              </div>
                                          </div>
                                          <div className="row justify-content-start align-items-start">
                                              <div className="col">
                                                  <section className="p-2">
                                                      <div className="container">
                                                          <div
                                                              className="bg-light border rounded border-0 border-light d-flex flex-column justify-content-between align-items-center flex-lg-row"
                                                              style={{ background: 'initial !important' }}
                                                          >
                                                              <div className="text-center mx-3 text-lg-start py-3 py-lg-1">
                                                                  <h5>Идентификационный номер</h5>
                                                              </div>
                                                              <form
                                                                  className="d-flex justify-content-center flex-wrap my-2"
                                                                  method="post"
                                                              >
                                                                  <div className="my-2 mx-2">
                                                                      <input
                                                                          className="form-control"
                                                                          type="email"
                                                                          placeholder=""
                                                                          onChange={this.onChangeIdNumber}
                                                                          value={this.state.idNumber}
                                                                      />
                                                                  </div>
                                                              </form>
                                                          </div>
                                                      </div>
                                                  </section>
                                              </div>
                                              <div className="col-12">
                                                  <section className="p-2">
                                                      <div className="container">
                                                          <input
                                                              className="btn btn-primary btn-lg d-block w-100"
                                                              type="button"
                                                              value="Сохранить"
                                                              onClick={this.updateProfile}
                                                          />
                                                      </div>
                                                      {this.state.info ? <label className="p-2 text-info">{ this.state.info }</label> : null}
                                                      {this.state.error ? <label className="p-2 text-danger">{ this.state.error }</label> : null}
                                                  </section>
                                              </div>
                                          </div>

                                      </div>
                                  </div>
                              </div>
                              <div className="col-md-12 col-lg-7">
                                  <div className="summary">
                                      <h3>активные договоры</h3>
                                  {this.state.dataLoaded ? this.renderContracts() : null}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
          </main>
          <Footer/>
      </div>
    );
  }
}

export default Profile;
