// src/components/FormInput.jsx
import React from "react";

export default function FormInput({ name, label, value, onChange, placeholder, required = false }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="required-star">*</span>}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Wpisz ${label.toLowerCase()}`}
        className="form-input"
        required={required}
      />
    </div>
  );
}