"use client";
import React, { useEffect, useState } from "react";
import "../sider.css";
import { getApiUrl } from "@/app/lib/config";

// Types pour les données
interface NamedEntity {
  id: string;
  name: string;
}

interface YearEntity {
  id: string;
  year: number;
}

interface SideBarProps {
  handlerCurrentData: (data: {
    yearId: string | null;
    documentTypeId: string | null;
    author: string | null;
    universityId: string | null;
    disciplineId: string | null;
    countryId: string | null;
  }) => void;
}

const SideBar: React.FC<SideBarProps> = ({ handlerCurrentData }) => {
  const [years, setYears] = useState<YearEntity[]>([]);
  const [universities, setUniversities] = useState<NamedEntity[]>([]);
  const [countries, setCountries] = useState<NamedEntity[]>([]);
  const [disciplines, setDisciplines] = useState<NamedEntity[]>([]);
  const [types, setTypes] = useState<NamedEntity[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const fetchAllData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    const endpoints = [
      { name: "years", url: "/admin/years" },
      { name: "universities", url: "/admin/universities" },
      { name: "countries", url: "/admin/countries" },
      { name: "disciplines", url: "/admin/disciplines" },
      { name: "types", url: "/admin/document-types" },
      { name: "author", url: "/document/authors" },
    ];


    
    const allData: Record<string, any[]> = {
      years: [],
      universities: [],
      countries: [],
      disciplines: [],
      types: [],
      authors: [],
    };

    try {
      for (const endpoint of endpoints) {
        const response = await fetch(`${getApiUrl(endpoint.url)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des ${endpoint.name}`);
        }

        const data = await response.json();
        allData[endpoint.name] = data;
      }

      setCountries(allData.countries);
      setDisciplines(allData.disciplines);
      setTypes(allData.types);
      setUniversities(allData.universities);
      setYears(allData.years);
      setAuthors(allData.author);

      return allData;
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Une erreur inconnue est survenue.");
      }
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target;

    switch (id) {
      case "DocType":
        setSelectedType(value);
        break;
      case "years":
        setSelectedYear(value);
        break;
      case "authors":
        setSelectedAuthor(value);
        break;
      case "universities":
        setSelectedUniversity(value);
        break;
      case "disciplines":
        setSelectedDiscipline(value);
        break;
      case "countries":
        setSelectedCountry(value);
        break;
    }

    handlerCurrentData({
      yearId: id === "years" ? value : selectedYear,
      documentTypeId: id === "DocType" ? value : selectedType,
      author: id === "authors" ? value : selectedAuthor,
      universityId: id === "universities" ? value : selectedUniversity,
      disciplineId: id === "disciplines" ? value : selectedDiscipline,
      countryId: id === "countries" ? value : selectedCountry,
    });
  };

  return (
    <section className="sider-bar px-5 py-10 w-full md:w-80 bg-gray-800 text-white min-h-screen md:min-h-0">
      <div>
        <form className="max-w-sm mx-auto regular">
          <select
            id="DocType"
            aria-label="Type de document"
            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            onChange={handleChange}
            value={selectedType || ""}
          >
            <option value="">Type de doc</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <br />
          <br />

          <select
            id="years"
            aria-label="Year"
            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            onChange={handleChange}
            value={selectedYear || ""}
          >
            <option value="">Années</option>
            {years.map((year) => (
              <option key={year.id} value={year.id}>
                {year.year}
              </option>
            ))}
          </select>

          <br />
          <br />
          <select
            id="authors"
             aria-label="Sélectionner un auteur"
            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            onChange={handleChange}
            value={selectedAuthor || ""}
          >
            <option value="">Auteurs</option>
            {authors.map((author, index) => (
              <option key={index} value={author}>
                {author}
              </option>
            ))}
          </select>

          <br />
          <br />

          <select
            id="universities"
             aria-label="Sélectionner une Université"

            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-700 focus:border-blue-700 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            onChange={handleChange}
            value={selectedUniversity || ""}
          >
            <option value="">Universités</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>

          <br />
          <br />

          <select
            id="disciplines"
             aria-label="Sélectionner une discipline"

            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-700 focus:border-blue-700 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            onChange={handleChange}
            value={selectedDiscipline || ""}
          >
            <option value="">Disciplines</option>
            {disciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name}
              </option>
            ))}
          </select>

          <br />
          <br />

          <select
            id="countries"
             aria-label="Sélectionner un pays"

            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-700 focus:border-blue-700 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            onChange={handleChange}
            value={selectedCountry || ""}
          >
            <option value="">Pays</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </form>
      </div>
    </section>
  );
};

export default SideBar;
