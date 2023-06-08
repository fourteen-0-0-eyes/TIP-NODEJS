import React, {ChangeEvent, Component} from 'react';
import Helmet from 'react-helmet'
import { Header } from './Header';
import { Footer } from './Footer';

type State = {
    cartNumber: number
}
class Pricing extends Component<any, State> {
    public constructor(props: any) {
        super(props);
        this.onSet1 = this.onSet1.bind(this)
        this.onSet2 = this.onSet2.bind(this)
        this.onSet3 = this.onSet3.bind(this)

        this.state = {
            cartNumber: 0
        };
    };

    public onSet1(e: any) {
        localStorage.removeItem('cartNumber')
        localStorage.setItem('cartNumber', '1')
    }

    public onSet2(e: any) {
        localStorage.removeItem('cartNumber')
        localStorage.setItem('cartNumber', '2')
    }

    public onSet3(e: any) {
        localStorage.removeItem('cartNumber')
        localStorage.setItem('cartNumber', '3')
    }

    public render(): JSX.Element {
    return (
      <div className="app-container">
          <Helmet>
              <meta charSet="utf-8" />
              <title>Тарифы - Могилевоблгаз</title>
          </Helmet>
          <Header/>
          <main className="page pricing-table-page">
              <section className="clean-block clean-pricing dark">
                  <div className="container">
                      <div className="block-heading">
                          <h2 className="text-info">Листинг тарифов</h2>
                          <p>Мы предоставляем различные виды тарифного обслуживания клиентов</p>
                      </div>
                      <div className="row justify-content-center">
                          <div className="col-md-5 col-lg-4">
                              <div className="clean-pricing-item" style={{ minHeight: 520 }}>
                                  <div className="heading">
                                      <h3>Стандартный</h3>
                                  </div>
                                  <p>Пакет газового снабжения на длительный период</p>
                                  <div className="features">
                                      <h4>
                <span className="feature">
                  Бесплатная замена оборудования:&nbsp;
                </span>
                                          <span>Нет</span>
                                      </h4>
                                      <h4>
                                          <span className="feature">Длительность:&nbsp;</span>
                                          <span>1 год</span>
                                      </h4>
                                      <h4>
                <span className="feature">
                  Гарантийный срок&nbsp; оборудования:&nbsp;
                </span>
                                          <span>период обслуживания</span>
                                      </h4>
                                  </div>
                                  <div className="price">
                                      <h4>389 BYN</h4>
                                  </div>
                                  <button
                                      className="btn btn-outline-primary d-block w-100"
                                      type="button" onClick={this.onSet1}
                                  >
                                      <a className="nav-link" href="/payment">
                                          &nbsp;Оформить
                                      </a>
                                  </button>
                              </div>
                          </div>
                          <div className="col-md-5 col-lg-4">
                              <div className="clean-pricing-item" style={{ minHeight: 520 }}>
                                  <div className="ribbon">
                                      <span>Популярный</span>
                                  </div>
                                  <div className="heading">
                                      <h3>Расширенный</h3>
                                  </div>
                                  <p>Дополнительная экономия на неожиданных поломках</p>
                                  <div className="features">
                                      <h4>
                <span className="feature">
                  <strong>Бесплатная замена оборудования:&nbsp;</strong>
                </span>
                                          <span>Да</span>
                                      </h4>
                                      <h4>
                <span className="feature">
                  <strong>Длительность:</strong>&nbsp;
                </span>
                                          <span>3 года</span>
                                      </h4>
                                      <h4>
                <span className="feature">
                  <strong>Гарантийный срок&nbsp; оборудования:</strong>&nbsp;
                </span>
                                          <span>
                  2 года
                  <br />
                </span>
                                      </h4>
                                  </div>
                                  <div className="price">
                                      <h4>
                                          959 BYN
                                          <br />
                                      </h4>
                                  </div>
                                  <button className="btn btn-primary d-block w-100" type="button" onClick={this.onSet2}>
                                      <a className="nav-link" href="/payment">
                                          &nbsp;Оформить
                                      </a>
                                  </button>
                              </div>
                          </div>
                          <div className="col-md-5 col-lg-4">
                              <div className="clean-pricing-item" style={{ minHeight: 520 }}>
                                  <div className="heading">
                                      <h3>Максимальный</h3>
                                  </div>
                                  <p>Полная поддержка</p>
                                  <div className="features">
                                      <h4>
                <span className="feature">
                  <strong>Бесплатная замена оборудования:&nbsp;</strong>&nbsp;
                </span>
                                          <span>Да</span>
                                      </h4>
                                      <h4>
                <span className="feature">
                  <strong>Длительность</strong>:&nbsp;
                </span>
                                          <span>7 лет</span>
                                      </h4>
                                      <h4>
                <span className="feature">
                  <strong>Гарантийный срок&nbsp; оборудования</strong>:&nbsp;
                </span>
                                          <span>период обслуживания</span>
                                      </h4>
                                      <h4>
                                          <span>Персональные бонусы</span>
                                      </h4>
                                  </div>
                                  <div className="price">
                                      <h4>2300 BYN</h4>
                                  </div>
                                  <button
                                      className="btn btn-outline-primary d-block w-100"
                                      type="button" onClick={this.onSet3}
                                  >
                                      <a className="nav-link" href="/payment">
                                          &nbsp;Оформить
                                      </a>
                                  </button>
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

export default Pricing;
