/*
 * Copyright (c) 2017, Globo.com <https://github.com/globocom/megadraft-chart-plugin>
 *
 * License: MIT
 */

import React from "react";

export function TextInput({name, placeholder="", type="text", onChange, defaultValue, className}) {
  let classNameArray = ["bs-ui-form-control__field"];
  if (className) {
    classNameArray.push(className);
  }
  return (
    <input
      type={type}
      className={classNameArray.join(" ")}
      placeholder={placeholder}
      name={name}
      onChange={onChange}
      value={defaultValue || ""}
    />
  );
}

export function TextInputGroup({label, className, ...props}) {
  let classNameArray = ["bs-ui-form-control"];
  if (className) {
    classNameArray.push(className);
  }

  return (
    <div className={classNameArray.join(" ")}>
      <label className="bs-ui-form-control__label">{ label }</label>
      <TextInput {...props} />
    </div>
  );
}
