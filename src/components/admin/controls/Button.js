/*
 * Copyright (c) 2017, Globo.com <https://github.com/globocom/megadraft-chart-plugin>
 *
 * License: MIT
 */

import React from "react";

function FormButton({className, name, onClick, children}) {
  return (
    <button
      className={className}
      name={name}
      onClick={onClick}>
      {children}
    </button>
  );
}

export function FormCloseButton({className = "", ...props}) {
  const closeButtonClassNames = [
    ...className,
    "bs-ui-button--red",
    "chart-modal__form__btn-remove"
  ];

  return (
    <FormButton
      {...props}
      className={closeButtonClassNames.join(" ")}
    />
  );
}

export function FormPlusButton({className = "", ...props}) {
  const plusButtonClassNames = [
    "add-button"
  ];

  return (
    <FormButton
      {...props}
      className={plusButtonClassNames.join(" ")}
    />
  );
}
