import React, { Component } from 'react';
import { getPath } from '../utilities/url-utils';


export class Header extends Component {

  public render(): JSX.Element {
    return (
        <nav className="navbar navbar-light navbar-expand-lg fixed-top bg-white clean-navbar">
            <div className="container">
                <a className="navbar-brand logo" href="#">
                    Могилевоблгаз
                </a>
                <button
                    data-bs-toggle="collapse"
                    className="navbar-toggler"
                    data-bs-target="#navcol-1"
                >
                    <span className="visually-hidden">Toggle navigation</span>
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navcol-1">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className={'nav-link ' + (getPath() === '' ? 'active' : '')} href="\">
                                главная
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={'nav-link ' + (getPath() === '/features' ? 'active' : '')} href="\features">
                                услуги
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={'nav-link ' + (getPath() === '/pricing' ? 'active' : '')} href="\pricing">
                                тарифы
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={'nav-link ' + (getPath() === '/login' ? 'active' : '')} href="\login">
                                {localStorage.getItem('username') ? 'профиль' : 'войти'}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
  }
}
