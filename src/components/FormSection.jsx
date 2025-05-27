// src/components/FormSection.jsx
import React from "react";

export default function FormSection({ title, children }) {
  return (
    <div className="form-section">
      <h3 className="form-section-title">{title}</h3>
      <div className="form-section-content">{children}</div>
    </div>
  );
}