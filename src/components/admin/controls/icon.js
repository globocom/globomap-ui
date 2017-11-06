/*
 * Copyright (c) 2017, Globo.com <https://github.com/globocom/megadraft-chart-plugin>
 *
 * License: MIT
 */

import React from "react";

export class PluginIcon extends React.Component {
  render() {
    return (
      <svg {...this.props} width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="48" fillRule="nonzero" fill="#FFFFFF">
            <g id="icone-grafico" transform="translate(6.000000, 7.000000)">
              <polygon id="Shape" points="7.875 4.93875 10.26 0.815625 11.233125 1.378125 8.29125 6.46875 4.629375 4.359375 1.94625 9 11.25 9 11.25 10.125 0 10.125 0 0 1.125 0 1.125 8.17875 4.21875 2.8125"></polygon>
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export function PlusIcon() {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
      <path fill="#000000" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
      <path fill="#000000" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
    </svg>
  );
}
