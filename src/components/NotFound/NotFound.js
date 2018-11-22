/*
Copyright 2018 Globo.com

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';


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
