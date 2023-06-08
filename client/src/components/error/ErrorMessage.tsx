import React from 'react';
import './ErrorMessage.css';

export interface IErrorProps {
  message: string;
}

export function ErrorMessage(props: IErrorProps): JSX.Element {
  return (
    <div className="error-message">
      <h5>Oops, something is wrong...</h5>
      <p>{props.message}</p>
    </div>
  );
}
