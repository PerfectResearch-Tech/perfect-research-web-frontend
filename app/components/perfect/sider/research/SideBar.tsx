"use client";
import React, { useEffect, useState } from "react";
import "../sider.css";
import { getApiUrl } from "@/app/lib/config";

const SideBar = ({
  handlerCurrentData,
}: {
  handlerCurrentData: (data: any) => void;
}) => {
  const [years, setYears] = useState<number[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(
    null
  );
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const fetchAllData = async () => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("accessToken");

    // Vérifier que le token est présent
    if (!token) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    // Définir les endpoints pour chaque type de données
    const endpoints = [
      { name: "years", url: "/admin/years" },
      { name: "universities", url: "/admin/universities" },
      { name: "countries", url: "/admin/countries" },
      { name: "disciplines", url: "/admin/disciplines" },
      { name: "types", url: "/admin/document-types" },
      { name: "author", url: "/document/authors" },
    ];

    // Objet pour stocker les données récupérées
    const allData: Record<string, any[]> = {
      years: [],
      universities: [],
      countries: [],
      disciplines: [],
      types: [],
      authors: [],
    };

    try {
      // Parcourir chaque endpoint et récupérer les données
      for (const endpoint of endpoints) {
        const response = await fetch(
          // `http://192.168.1.205:3001${endpoint.url}`,
          `${getApiUrl(endpoint.url)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
            },
          }
        );

        // Vérifier si la requête a réussi
        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des ${endpoint.name}`
          );
        }

        // Ajouter les données récupérées à l'objet allData
        const data = await response.json();
        allData[endpoint.name] = data;
      }

      // Afficher les données récupérées dans la console
      // console.log("Données récupérées avec succès :", allData);

      setCountries(allData.countries);
      // console.log("allData.countries", allData.countries);
      setDisciplines(allData.disciplines);
      // console.log("allData.disciplines", allData.disciplines);
      setTypes(allData.types);
      // console.log("allData.types", allData.types);
      setUniversities(allData.universities);
      // console.log("allData.universities", allData.universities);
      setYears(allData.years);
      // console.log("allData.years", allData.years);
      setAuthors(allData.author);
      // console.log("allData.author", allData.author);

      // Retourner les données pour une utilisation ultérieure
      return allData;
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);

      // Afficher un message d'erreur à l'utilisateur
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

  // Gestionnaire d'événements pour le changement de sélection
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
          {/* <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select an option
          </label> */}
          <select
            id="DocType"
            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            onChange={handleChange}
            value={selectedType || ""}
          >
            <option value="">Type de doc</option>
            {types.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <br />
          <br />

          <select
            id="years"
            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            onChange={handleChange}
            value={selectedYear || ""}
          >
            <option value="">Années</option>
            {years.map((year: any) => (
              <option key={year.id} value={year.id}>
                {year.year}
              </option>
            ))}
          </select>

          <br />
          <br />
          <select
            id="authors"
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

          {/* Sélection des universités */}
          <select
            id="universities"
            className="py-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-700 focus:border-blue-700 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 quicksand-bold"
            // onChange={(e) => handleChange(e)}
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

          {/* Sélection des disciplines */}
          <select
            id="disciplines"
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

          {/* Sélection des pays */}
          <select
            id="countries"
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
