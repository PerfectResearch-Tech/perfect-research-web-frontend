import { getApiUrl } from "@/app/lib/config";
import Image from "next/image";
import React from "react";
import { FaDownload } from "react-icons/fa";

const DocumentsSession = ({
  title,
  type,
  year,
  author,
  discipline,
  university,
  country,
  path,
}: {
  title: string;
  type: string;
  year: number | string;
  author: string;
  discipline: string;
  university: string;
  country: string;
  path: any;
}) => {
  const handleDownload = async () => {
    try {
      let url = getApiUrl(path); // URL brute depuis getApiUrl

      // Corrige l'URL en insérant un / avant uploads si absent
      const parts = url.split("3001"); // Sépare après le port
      if (parts.length === 2 && !parts[1].startsWith("/")) {
        url = `${parts[0]}3001/${parts[1]}`; // Ajoute le / après :3001
      }

      if (!url.startsWith("http")) throw new Error("URL invalide");

      const response = await fetch(url);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération du fichier");

      const blob = await response.blob();
      const fileName = url.split("/").pop() || "document";
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Erreur de téléchargement :", error);
      alert("Impossible de télécharger le fichier.");
    }
  };

  return (
    <div className="my-6">
      <div className="flex flex-row gap-8">
        <Image
          src="/assets/images/png/pdf.png"
          alt="microphone"
          width={180}
          height={130}
          className="w-24 sm:w-32 md:w-40 lg:w-48 h-auto"
        />
        <div>
          <h3 className="regular text-primary">{title}</h3>
          {/* <br /> */}
          <p>Type : {type}</p>
          <p>Année : {year}</p>
          <p>Auteur : {author}</p>
          <p>Discipline : {discipline}</p>
          <p>Université : {university}</p>
          <p>Pays : {country}</p>
          <button onClick={handleDownload} className="text-primary">
            <FaDownload />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsSession;
