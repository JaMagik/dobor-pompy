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
      { name: "imie", label: "Imię", required: true, type: "text" },
      { name: "telefon", label: "Telefon", required: true, type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "adres", label: "Adres", type: "text" },
    ],
  },
  expectations: {
    title: "Oczekiwania",
    checkboxes: ["Pompa ciepła", "Panele fotowoltaiczne", "Rekuperacja"],
  },
  building: {
    title: "Dane budynku",
    fields: [
      {
        name: "budynek",
        label: "Typ budynku",
        type: "select",
        options: [
          "",
          "Jednorodzinny",
          "Bliźniak",
          "Szeregowy",
          "Wielorodzinny (np. kamienica, blok)",
          "Gospodarczy",
          "Usługowy",
          "Inny",
        ],
      },
      {
        name: "dataBudowy",
        label: "Data budowy",
        type: "select",
        options: [
          "",
          "Przed 1945",
          "1945 - 1970",
          "1971 - 1990",
          "1991 - 2000",
          "2001 - 2010",
          "2011 - 2020",
          "Po 2020",
          "W trakcie budowy",
        ],
      },
      { name: "powierzchnia", label: "Powierzchnia całkowita", type: "text" },
      // Wysokość usunięta
      {
        name: "konstrukcja",
        label: "Konstrukcja budynku",
        type: "select",
        options: [
          "",
          "Murowana",
          "Drewniana (np. szkieletowa, z bali)",
          "Wielka płyta",
          "Mieszana",
          "Inna",
        ],
      },
      {
        name: "sciany",
        label: "Rodzaj ścian",
        type: "select",
        options: [
          "",
          "Cegła pełna",
          "Pustak ceramiczny (np. Porotherm, Leier)",
          "Beton komórkowy (np. Suporex, Ytong)",
          "Silikaty",
          "Pustak żużlobetonowy",
          "Drewno",
          "Inne",
        ],
      },
      {
        name: "ocieplenie",
        label: "Ocieplenie",
        type: "select",
        options: [
          "",
          "Styropian (biały, grafitowy)",
          "Wełna mineralna (skalna, szklana)",
          "Pianka poliuretanowa (PUR/PIR)",
          "Brak ocieplenia",
          "Nie wiem",
          "Inne",
        ],
      },
      { name: "docieplony", label: "Dom docieplony", type: "text" },
      { name: "okna", label: "Okna", type: "text", placeholder: "Wpisz rodzaj okien i ich ilość" },
      { name: "drzwi", label: "Drzwi", type: "text", placeholder: "Wpisz rodzaj drzwi i ich ilość" },
    ],
  },
  tech: {
    title: "Parametry techniczne",
    fields: [
      {
        name: "izolacjaDachu",
        label: "Izolacja dachu",
        type: "select",
        options: [
          "",
          "Wełna mineralna (skalna, szklana)",
          "Styropian / Styropapa",
          "Pianka poliuretanowa (PUR/PIR)",
          "Celuloza (włókna celulozowe)",
          "Brak ocieplenia",
          "Nie wiem",
          "Inne",
        ],
      },
      { name: "izolacjaPodlogi", label: "Izolacja podłogi", type: "text" },
      // Temperatura zimą usunięta
      {
        name: "wentylacja",
        label: "Wentylacja",
        type: "select",
        options: [
            "",
            "Grawitacyjna",
            "Mechaniczna z odzyskiem ciepła (Rekuperacja)",
            "Mechaniczna (bez odzysku)",
            "Inna"
        ]
      },
      { name: "ileOsob", label: "CWU - ile osób", type: "text" },
      {
        name: "zrodlo",
        label: "Obecne źródło ogrzewania",
        type: "select",
        options: [
            "",
            "Kocioł węglowy",
            "Kocioł gazowy",
            "Kocioł olejowy",
            "Kocioł na pellet/drewno",
            "Ogrzewanie elektryczne (np. grzejniki, piece akumulacyjne)",
            "Kominek z płaszczem wodnym",
            "Miejska sieć ciepłownicza",
            "Brak - nowy budynek",
            "Inne"
        ]
      },
      { name: "system", label: "System ogrzewania", type: "text" }, // To pole można by też rozwinąć na select jeśli są typowe systemy
      // Temp. podłogowe usunięte
      // Temp. grzejniki usunięte
      {
        name: "rodzajGrzejnika",
        label: "Rodzaj grzejnika",
        type: "select",
        options: [
            "",
            "Grzejniki panelowe stalowe",
            "Grzejniki aluminiowe",
            "Grzejniki żeliwne",
            "Grzejniki konwektorowe",
            "Ogrzewanie podłogowe",
            "Klimakonwektory",
            "Mieszane (np. podłogówka + grzejniki)",
            "Inne"
        ]
      },
    ],
  },
};

export default function PompaForm() {
  const [form, setForm] = useState({
    imie: "", telefon: "", email: "", oczekiwania: [], budynek: "",
    adres: "", dataBudowy: "", powierzchnia: "", /* wysokosc usunięte */
    konstrukcja: "", sciany: "", ocieplenie: "", docieplony: "",
    okna: "", drzwi: "", izolacjaDachu: "", izolacjaPodlogi: "",
    /* temperaturaZima usunięte */ wentylacja: "", ileOsob: "", zrodlo: "",
    system: "", /* tempPodlogowe usunięte */ /* tempGrzejniki usunięte */ rodzajGrzejnika: "",
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