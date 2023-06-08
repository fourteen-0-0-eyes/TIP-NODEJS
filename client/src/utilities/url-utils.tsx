import {Navigate} from 'react-router-dom';
import React from 'react';

export function getPath(): string{
    return window.location.pathname.replace(/\/+$/, '');
}

export function requireAuth(revert: boolean): JSX.Element{
    const auth = localStorage.getItem('JWT')
    if (revert && !auth){
        return (
            <Navigate to="/login"/>
        )
    }

    if (!revert && auth) {
        return (
            <Navigate to="/profile"/>
        )
    }
}

export function requireCart(): JSX.Element {
    if (!localStorage.getItem('cartNumber')){
        return (
            <Navigate to="/pricing"/>
        )
    }
}

