import React, { Component } from 'react';

export class Footer extends Component {
    public render(): JSX.Element {
        return (
            <footer className="page-footer dark" style={{ paddingTop: 0 }}>
                <div className="footer-copyright">
                    <p>
                        © 2023&nbsp; ПРОИЗВОДСТВЕННОЕ РЕСПУБЛИКАНСКОЕ УНИТАРНОЕ ПРЕДПРИЯТИЕ
                        «МОГИЛЕВОБЛГАЗ»
                    </p>
                </div>
            </footer>
        );
    }
}
