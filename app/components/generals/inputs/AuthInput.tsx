import React from "react";

const AuthInput = (label: string, placeholder: string, className: string) => {
  return (
    <div>
      <label htmlFor="email">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        id="email"
        className={className}
      />
    </div>
  );
};

export default AuthInput;
