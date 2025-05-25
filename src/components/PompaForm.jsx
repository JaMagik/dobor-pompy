import React, { useState } from "react";
import { generatePDF } from "./PompaPDF";

export default function PompaForm() {
  const [form, setForm] = useState({
    imie: "",
    telefon: "",
    email: "",
    oczekiwania: [],
    budynek: "",
    adres: "",
    dataBudowy: "",
    powierzchnia: "",
    wysokosc: "",
    konstrukcja: "",
    sciany: "",
    ocieplenie: "",
    docieplony: "",
    okna: "",
    drzwi: "",
    izolacjaDachu: "",
    izolacjaPodlogi: "",
    temperaturaZima: "",
    wentylacja: "",
    ileOsob: "",
    zrodlo: "",
    system: "",
    tempPodlogowe: "",
    tempGrzejniki: "",
    rodzajGrzejnika: "",
  });

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
    generatePDF(form);
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Dane do doboru pompy ciepła</h2>

      <form onSubmit={handleSubmit}>
        {/* Podstawowe dane */}
        <div className="form-section">
          <h3>Podstawowe dane</h3>
          {["imie", "telefon", "email", "adres"].map((field) => (
            <div key={field} className="form-group">
              <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={`Wpisz ${field}`}
                className="form-input"
              />
            </div>
          ))}
        </div>

        {/* Oczekiwania */}
        <div className="form-section">
          <h3>Oczekiwania</h3>
          <div className="checkbox-group">
            {["Pompa ciepła", "Panele fotowoltaiczne", "Rekuperacja"].map((item) => (
              <label key={item} className="checkbox-label">
                <input
                  type="checkbox"
                  name="oczekiwania"
                  value={item}
                  onChange={handleChange}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Dane budynku */}
        <div className="form-section">
          <h3>Dane budynku</h3>
          {[
            ["Typ budynku", "budynek"],
            ["Data budowy", "dataBudowy"],
            ["Powierzchnia całkowita", "powierzchnia"],
            ["Wysokość", "wysokosc"],
            ["Konstrukcja budynku", "konstrukcja"],
            ["Rodzaj ścian", "sciany"],
            ["Ocieplenie", "ocieplenie"],
            ["Dom docieplony", "docieplony"],
            ["Okna", "okna"],
            ["Drzwi", "drzwi"],
          ].map(([label, name]) => (
            <div key={name} className="form-group">
              <label className="form-label">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={`Wpisz ${label.toLowerCase()}`}
                className="form-input"
              />
            </div>
          ))}
        </div>

        {/* Parametry techniczne */}
        <div className="form-section">
          <h3>Parametry techniczne</h3>
          {[
            ["Izolacja dachu", "izolacjaDachu"],
            ["Izolacja podłogi", "izolacjaPodlogi"],
            ["Temperatura zimą", "temperaturaZima"],
            ["Wentylacja", "wentylacja"],
            ["CWU - ile osób", "ileOsob"],
            ["Obecne źródło ogrzewania", "zrodlo"],
            ["System ogrzewania", "system"],
            ["Temp. podłogowe", "tempPodlogowe"],
            ["Temp. grzejniki", "tempGrzejniki"],
            ["Rodzaj grzejnika", "rodzajGrzejnika"],
          ].map(([label, name]) => (
            <div key={name} className="form-group">
              <label className="form-label">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={`Wpisz ${label.toLowerCase()}`}
                className="form-input"
              />
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">Wygeneruj PDF</button>
      </form>
    </div>
  );
}
