import React, { Component } from 'react';
import Helmet from 'react-helmet'
import { Header } from './Header';
import { Footer } from './Footer';

class Features extends Component {
  public render(): JSX.Element {
    return (
      <div className="app-container">
          <Helmet>
              <meta charSet="utf-8" />
              <title>Услуги - Могилевоблгаз</title>
          </Helmet>
          <Header/>
          <main className="page">
              <section className="clean-block features">
                  <div className="container">
                      <div className="block-heading">
                          <h2 className="text-info">&nbsp;Услуги</h2>
                          <p>
                              Могилевоблаз предоставляет широкий диапазон газовых услуг в Могилеве
                              и Могилевской области
                          </p>
                      </div>
                      <section className="py-4 py-xl-5">
                          <div className="container">
                              <div className="text-white bg-primary border rounded border-0 border-primary d-flex flex-column justify-content-between flex-lg-row p-4 p-md-5">
                                  <div className="pb-2 pb-lg-1">
                                      <h2 className="fw-bold mb-2">
                                          Пакет снабжения газом и технического обслуживания
                                          газоиспользующего оборудования
                                      </h2>
                                      <p className="mb-0">
                                          Необходимо ознакомиться с договором и выбрать тариф
                                          обслуживания
                                      </p>
                                  </div>
                                  <div className="my-2">
                                      <a
                                          className="btn btn-light fs-5 py-2 px-4"
                                          role="button"
                                          href="/pricing"
                                      >
                                          Подключить
                                      </a>
                                  </div>
                              </div>
                          </div>
                      </section>
                      <div className="row justify-content-center">
                          <div className="col-md-5 feature-box">
                              <i className="icon-user icon" />
                              <h4>Сопровождение</h4>
                              <p>
                                  Ответим на все необходимые вопросы и установим газовое
                                  оборудование в короткие сроки
                              </p>
                          </div>
                          <div className="col-md-5 feature-box">
                              <i className="icon-magnifier icon" />
                              <h4>Сертификация</h4>
                              <p>
                                  Проверенные годами технологии обеспечат стабильную поставку газа,
                                  а сертифицированное оборудование убережет от неприятных поломок
                              </p>
                          </div>
                          <div className="col-md-5 feature-box">
                              <i className="icon-like icon" />
                              <h4>Отзывы</h4>
                              <p>
                                  Тысячи клиентов по всей Могилевской области выбирают Могилевоблгаз
                              </p>
                          </div>
                          <div className="col-md-5 feature-box">
                              <i className="icon-refresh icon" />
                              <h4>Обновление</h4>
                              <p>
                                  Продление договора в 2 клика позволяет не задумываться о сложных
                                  юридических процедурах
                              </p>
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

export default Features;
