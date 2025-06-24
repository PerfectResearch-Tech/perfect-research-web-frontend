"use client";
import React, { useEffect, useState, useCallback } from "react";
import "../main.css";
import DocumentsSession from "./DocumentsSession";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading/Loading";
import { getApiUrl } from "@/app/lib/config";

interface DocumentType {
  id: string;
  title: string;
  typeId?: string;
  yearId?: string;
  author: string;
  disciplineId?: string;
  universityId?: string;
  documentTypeId?: string;
  countryId?: string;
  path: string;
}

interface FilterData {
  [key: string]: string | number | null | undefined;
}

interface Props {
  data: FilterData;
}

const MainSession = ({ data }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [types, setTypes] = useState<{ [key: string]: string }>({});
  const [disciplines, setDisciplines] = useState<{ [key: string]: string }>({});
  const [universities, setUniversities] = useState<{ [key: string]: string }>({});
  const [countries, setCountries] = useState<{ [key: string]: string }>({});
  const [years, setYears] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.push("/pages/authentication/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const fetchDetails = async (endpoint: string, id: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return null;
    }

    try {
      const response = await fetch(
        `${getApiUrl(endpoint)}/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des détails pour ${endpoint}/${id}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des détails :", error);
      toast.error("Erreur lors de la récupération des détails");
      return null;
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(
        `${getApiUrl("/document")}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des documents");
      }

      const data = await response.json();
      setDocuments(data);

      for (const document of data) {
        if (document.documentTypeId) {
          const typeDetails = await fetchDetails(
            "/admin/document-type",
            document.documentTypeId
          );
          if (typeDetails) {
            setTypes((prev) => ({
              ...prev,
              [document.documentTypeId]: typeDetails.name,
            }));
          }
        }

        if (document.disciplineId) {
          const disciplineDetails = await fetchDetails(
            "/admin/discipline",
            document.disciplineId
          );
          if (disciplineDetails) {
            setDisciplines((prev) => ({
              ...prev,
              [document.disciplineId]: disciplineDetails.name,
            }));
          }
        }

        if (document.universityId) {
          const universityDetails = await fetchDetails(
            "/admin/university",
            document.universityId
          );
          if (universityDetails) {
            setUniversities((prev) => ({
              ...prev,
              [document.universityId]: universityDetails.name,
            }));
          }
        }

        if (document.countryId) {
          const countryDetails = await fetchDetails(
            "/admin/country",
            document.countryId
          );
          if (countryDetails) {
            setCountries((prev) => ({
              ...prev,
              [document.countryId]: countryDetails.name,
            }));
          }
        }

        if (document.yearId) {
          const yearDetails = await fetchDetails(
            "/admin/year",
            document.yearId
          );
          if (yearDetails) {
            setYears((prev) => ({
              ...prev,
              [document.yearId]: yearDetails.year,
            }));
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      toast.error("Erreur lors de la récupération des données");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFilterdData = useCallback(async (filterData: FilterData) => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(
        `${getApiUrl("/document/search")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filterData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du filtrage des documents");
      }

      const result = await response.json();
      setDocuments(result);

      for (const document of result) {
        if (document.typeId && !types[document.typeId]) {
          const typeDetails = await fetchDetails("/type", document.typeId);
          if (typeDetails) {
            setTypes((prev) => ({
              ...prev,
              [document.typeId]: typeDetails.name,
            }));
          }
        }

        if (document.disciplineId && !disciplines[document.disciplineId]) {
          const disciplineDetails = await fetchDetails(
            "/admin/discipline",
            document.disciplineId
          );
          if (disciplineDetails) {
            setDisciplines((prev) => ({
              ...prev,
              [document.disciplineId]: disciplineDetails.name,
            }));
          }
        }

        if (document.universityId && !universities[document.universityId]) {
          const universityDetails = await fetchDetails(
            "/admin/university",
            document.universityId
          );
          if (universityDetails) {
            setUniversities((prev) => ({
              ...prev,
              [document.universityId]: universityDetails.name,
            }));
          }
        }

        if (document.yearId && !years[document.yearId]) {
          const yearDetails = await fetchDetails(
            "/admin/year",
            document.yearId
          );
          if (yearDetails) {
            setYears((prev) => ({
              ...prev,
              [document.yearId]: yearDetails.year,
            }));
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      toast.error("Erreur lors de la récupération des données");
    } finally {
      setIsLoading(false);
    }
  }, [types, disciplines, universities, years]);

  // Nouvelle fonction pour la recherche par mots-clés
  const fetchSearchKeywords = useCallback(async (keywords: string) => {
    setIsLoading(true);

    if (!keywords) {
      fetchData();
      setIsLoading(false);
      return;
    }
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(
        `${getApiUrl("/document/search-keyword")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keyword: keywords }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche par mots-clés");
      }

      const result = await response.json();
      setDocuments(result);
    } catch (error) {
      console.error("Erreur lors de la recherche par mots-clés :", error);
      toast.error("Erreur lors de la recherche par mots-clés");
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  // Fonction pour gérer la recherche instantanée
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSearchKeywords(query);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasFilters = (data: FilterData) =>
    Object.values(data).some((value) => value !== null && value !== "");

  useEffect(() => {
    if (data && hasFilters(data)) {
      fetchFilterdData(data);
    }
  }, [data, fetchFilterdData]);

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 w-full">
      <h1 className="regular">
        Trouvez un document grâce au perfect research
      </h1>
      <br />
      <form className="w-full mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="search"
              id="default-search"
              className="block w-full px-3 py-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:text-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Rechercher un document ..."
              required
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </form>
      <br />
      <br />

      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {documents.map((document) => (
            <DocumentsSession
              key={document.id}
              title={document.title || "Titre non disponible"}
              type={document.documentTypeId ? types[document.documentTypeId] || "Type non disponible" : "Type non disponible"}
              year={
                document.yearId && years[document.yearId] !== undefined
                  ? years[document.yearId]
                  : "Année non disponible"
              }
              author={document.author || "Auteur non disponible"}
              discipline={
                document.disciplineId
                  ? disciplines[document.disciplineId] || "Discipline non disponible"
                  : "Discipline non disponible"
              }
              country={
                document.countryId
                  ? countries[document.countryId] || "Pays non disponible"
                  : "Pays non disponible"
              }
              university={
                document.universityId
                  ? universities[document.universityId] || "Université non disponible"
                  : "Université non disponible"
              }
              path={document.path || "Valeur non disponible"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainSession;
