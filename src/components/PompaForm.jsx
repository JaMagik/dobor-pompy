// src/components/PompaForm.jsx
import React, { useState, useEffect } from "react";
import { generatePDF } from "./PompaPDF";
import FormSection from "./FormSection";
import FormInput from "./FormInput";

// Definicje pól formularza dla łatwiejszego zarządzania
const sections = {
  basic: {
    title: "Podstawowe dane",
    fields: [
      { name: "imie", label: "Imię", required: true },
      { name: "telefon", label: "Telefon", required: true },
      { name: "email", label: "Email" },
      { name: "adres", label: "Adres" },
    ],
  },
  expectations: {
    title: "Oczekiwania",
    checkboxes: ["Pompa ciepła", "Panele fotowoltaiczne", "Rekuperacja"],
  },
  building: {
    title: "Dane budynku",
    fields: [
      { name: "budynek", label: "Typ budynku" },
      { name: "dataBudowy", label: "Data budowy" },
      { name: "powierzchnia", label: "Powierzchnia całkowita" },
      { name: "wysokosc", label: "Wysokość" },
      { name: "konstrukcja", label: "Konstrukcja budynku" },
      { name: "sciany", label: "Rodzaj ścian" },
      { name: "ocieplenie", label: "Ocieplenie" },
      { name: "docieplony", label: "Dom docieplony" },
      { name: "okna", label: "Okna" },
      { name: "drzwi", label: "Drzwi" },
    ],
  },
  tech: {
    title: "Parametry techniczne",
    fields: [
      { name: "izolacjaDachu", label: "Izolacja dachu" },
      { name: "izolacjaPodlogi", label: "Izolacja podłogi" },
      { name: "temperaturaZima", label: "Temperatura zimą" },
      { name: "wentylacja", label: "Wentylacja" },
      { name: "ileOsob", label: "CWU - ile osób" },
      { name: "zrodlo", label: "Obecne źródło ogrzewania" },
      { name: "system", label: "System ogrzewania" },
      { name: "tempPodlogowe", label: "Temp. podłogowe" },
      { name: "tempGrzejniki", label: "Temp. grzejniki" },
      { name: "rodzajGrzejnika", label: "Rodzaj grzejnika" },
    ],
  },
};

export default function PompaForm() {
  const [form, setForm] = useState({
    imie: "", telefon: "", email: "", oczekiwania: [], budynek: "",
    adres: "", dataBudowy: "", powierzchnia: "", wysokosc: "",
    konstrukcja: "", sciany: "", ocieplenie: "", docieplony: "",
    okna: "", drzwi: "", izolacjaDachu: "", izolacjaPodlogi: "",
    temperaturaZima: "", wentylacja: "", ileOsob: "", zrodlo: "",
    system: "", tempPodlogowe: "", tempGrzejniki: "", rodzajGrzejnika: "",
  });
  
  const [isSubmittable, setIsSubmittable] = useState(false);

  // Efekt do sprawdzania walidacji
  useEffect(() => {
    // Prosta walidacja: sprawdź, czy wymagane pola nie są puste
    if (form.imie.trim() !== "" && form.telefon.trim() !== "") {
      setIsSubmittable(true);
    } else {
      setIsSubmittable(false);
    }
  }, [form.imie, form.telefon]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        oczekiwania: checked
          ? [...prev.oczekiwania, value]
          : prev.oczekiwania.filter((item) => item !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (isSubmittable) {
      generatePDF(form);
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Dane do doboru pompy ciepła</h2>

      <form onSubmit={handleSubmit}>
        <FormSection title={sections.basic.title}>
          {sections.basic.fields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}
        </FormSection>

        <FormSection title={sections.expectations.title}>
          <div className="checkbox-group">
            {sections.expectations.checkboxes.map((item) => (
              <label key={item} className="checkbox-label">
                <input
                  type="checkbox"
                  name="oczekiwania"
                  value={item}
                  checked={form.oczekiwania.includes(item)}
                  onChange={handleChange}
                />
                {item}
              </label>
            ))}
          </div>
        </FormSection>
        
        <FormSection title={sections.building.title}>
          {sections.building.fields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}
        </FormSection>
        
        <FormSection title={sections.tech.title}>
          {sections.tech.fields.map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}
        </FormSection>

        <button type="submit" className="submit-btn" disabled={!isSubmittable}>
          Wygeneruj PDF
        </button>
      </form>
    </div>
  );
}