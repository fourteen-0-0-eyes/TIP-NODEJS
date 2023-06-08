import React, { Component } from 'react';
import Helmet from 'react-helmet'
import { connect, MapStateToProps } from 'react-redux';
import { Header } from './Header';
import { Footer } from './Footer';
import { ActionCreator, ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { IAction } from '../interfaces/action.interface';
import { IAppState } from '../reducers/reducer';
import { TestActionCreators } from '../utilities/test-action.creators';


interface IMainProps {
  isLoading: boolean;
  message: string;
  dispatchApiTestStart?: ActionCreator<IAction>;
}

class Main extends Component<IMainProps> {

  public onPingClick = () => {
    this.props.dispatchApiTestStart();
  }

  public render(): JSX.Element {
      const firstBlockStyle = {
          backgroundImage: 'url(/images/gas_landing.jpg)',
          color: 'rgba(9, 162, 255, 0.7)'
      };

      return (
      <div className="app-container">
          <Helmet>
              <meta charSet="utf-8" />
              <title>Главная - Могилевоблгаз</title>
          </Helmet>
          <Header />
          <main className="page landing-page">
              <section
                  className="clean-block clean-hero"
                  style={firstBlockStyle}
              >
                  <div className="text">
                      <h2>
                          РУП «Могилевоблгаз»
                          <br />
                      </h2>
                      <p style={{ textAlign: 'left' }}>
                          Производственное республиканское унитарное предприятие Могилевоблаз
                          предоставляет услуги по снабжению газом и технического сопровождения и
                          обслуживания газоиспользующего обрудования
                          <br />
                          <br />
                      </p>
                      <button className="btn btn-outline-light btn-lg" type="button">
                          <a className="nav-link" href="/features">
                              УСЛУГИ
                          </a>
                      </button>
                  </div>
              </section>
              <section className="clean-block clean-info dark">
                  <div className="container">
                      <div className="block-heading">
                          <h2 className="text-info">Сертифицированный поставщик</h2>
                          <p style={{ textAlign: 'justify', maxWidth: 'none' }}>
                              На предприятии разработана, внедрена и сертифицирована система
                              менеджмента качества, отвечающая требованиям стандарта СТБ ISO
                              9001-2015 в части выполнения функций заказчика в области
                              проектирования и строительства систем газоснабжения, распределения и
                              сбыта газообразного топлива
                              <br />
                          </p>
                      </div>
                      <div className="row align-items-center">
                          <div className="col-md-6">
                              <img
                                  className="img-thumbnail"
                                  src="/images/gas_landing_doc.png"
                              />
                          </div>
                          <div className="col-md-6">
                              <h3>Гарант качества</h3>
                              <div className="getting-started-info">
                                  <p>
                                      РУП «Могилевоблгаз» - Лауреат Премии Правительства Республики
                                      Беларусь за 2020 год за достижение значительных результатов в
                                      области качества и конкурентоспособности производимой продукции,
                                      оказываемых услуг или выполняемых работ, внедрение инновационных
                                      технологий и современных методов менеджмента.
                                      <br />
                                  </p>
                              </div>
                              <button className="btn btn-primary btn-lg" type="button">
                                  <a className="nav-link" href="/pricing">
                                      Ознакомиться с тарифами
                                  </a>
                              </button>
                          </div>
                      </div>
                  </div>
              </section>
              <section className="clean-block about-us" style={{ padding: 'initial' }}>
                  <div className="container">
                      <div className="block-heading">
                          <h2 className="text-info">Информация о предприятии</h2>
                          <p style={{ maxWidth: 'none', textAlign: 'justify' }}>
            <span style={{ color: 'rgb(101, 101, 101)' }}>
              Предприятием оказывается очень широкий спектр услуг, как
              юридическим лицам, так и гражданам. Это и проектирование объектов
              газораспределительной системы, и строительство, монтаж,
              обслуживание газопроводов и газового оборудования. В целях
              упрощения населению процесса получения от предприятия необходимых
              услуг огромное внимание уделяется вопросам организации работы с
              гражданами по заявительному принципу «одно окно». В подразделениях
              непосредственно работающих с населением работа построена таким
              образом, чтобы человек обращался на предприятие только один раз –
              пришел, написал заявление, заплатил и получил комплекс услуг.
              Подавляющее количество заявок граждан принимается по телефонным
              звонкам, причем заявки выполняется в самые кратчайшие сроки.
              Установлен удобный для населения режим работы подразделений,
              оказывающих гражданам услуги, налажена работа по предоставлению
              необходимой информации. Вся необходимая гражданам информация о
              работе предприятия, о видах оказываемых услуг, сроках их
              выполнения и порядке осуществления, а также о руководителях
              предприятия и специалистах, информации о работе филиалов на основе
              принципа «одно окно» размещена на информационных стендах.
              Информирование населения осуществляется также через местные СМИ. В
              целях упрощения процедуры получения справок об оплате за
              использованный газ с РКЦ, АСБ «Беларусбанк», Белпочта, ЖРЭО,
              отделами социальной защиты, местными органами власти налажен обмен
              информацией по электронной почте.
            </span>
                          </p>
                      </div>
                  </div>
              </section>
          </main>
          <Footer/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
