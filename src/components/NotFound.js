import React from 'react';
import { Link } from 'react-router-dom';
import './css/NotFound.css';


class NotFound extends React.Component {
  render() {
    return (
      <div className="not-found">
        <div className="not-found-title">
          <h1>
            <span className="status">404</span><br />
            <strong className="message">Not found!</strong>
          </h1>
          <p>
            <Link to="/" className="btn-back">
              &laquo;&nbsp;Go back
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default NotFound;
