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
import './Loading.css';

export class Loading extends React.Component {
  render() {
    const iconSizes = { 'small': 'fa-1x', 'medium': 'fa-2x','big': 'fa-3x' };
    const iconSize = Object.keys(iconSizes).includes(this.props.iconSize)
                      ? iconSizes[this.props.iconSize]
                      : iconSizes['medium'];
    return (
      this.props.isLoading &&
        <div className="ui-loading">
          <i className={`ui-loading-cog fa fa-cog fa-spin ${iconSize} fa-fw`}></i>
        </div>
    );
  }
}

export default Loading;
