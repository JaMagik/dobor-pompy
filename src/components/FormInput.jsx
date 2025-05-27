// src/components/FormInput.jsx
import React from "react";

export default function FormInput({ name, label, value, onChange, placeholder, required = false, type = "text", options = [] }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="required-star">*</span>}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="form-input" // Możesz chcieć dodać inną klasę dla selectów form-select
          required={required}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option || `Wybierz ${label.toLowerCase()}`}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Wpisz ${label.toLowerCase()}`}
          className="form-input"
          required={required}
        />
      )}
    </div>
  );
}