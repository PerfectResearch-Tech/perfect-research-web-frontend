import DocInputSession from "@/app/components/generals/inputs/DocInputSession";
import {
  SelectCountryOption,
  SelectOptionSection,
} from "@/app/components/generals/select/SelectOptionSection";
import DocTextArea from "@/app/components/generals/textarea/DocTextArea";
import ButtonLoading from "@/app/components/Loading/ButtonLoading";
import { getApiUrl } from "@/app/lib/config";
import Error from "next/error";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast, Toaster } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface FileWithPreview {
  id: string;
  file: File;
  preview: string;
}

const CountrySelect = () => {
  const [selectedStep, setSelectedStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [title, setTitle] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [author, setAuthor] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [university, setUniversity] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string>("");
  const [years, setYears] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);

  const router = useRouter();

  // Liste statique des doucuments
  // const docs = [{ type: "Mémoire" }, { type: "Thèse" }];

  // // Liste statique des doucuments
  // const years = [
  //   { id: "1", year: "2019" },
  //   { id: "2", year: "2020" },
  //   { id: "3", year: "2021" },
  //   { id: "4", year: "2022" },
  //   { id: "5", year: "2023" },
  //   { id: "6", year: "2024" },
  //   { id: "7", year: "2025" },
  // ];

  // // Liste statique des Universités
  // const universities = [
  //   { id: "1", university: "Ul Lomé" },
  //   { id: "2", university: "Uk Kara" },
  //   { id: "3", university: "Esig Global Success" },
  //   { id: "4", university: "ESA" },
  //   { id: "5", university: "ESMA" },
  //   { id: "6", university: "ESGIS" },
  //   { id: "7", university: "DEFITCH" },
  // ];

  // // Liste statique des Disciplines
  // const disciplines = [
  //   { id: "1", discipline: "Cyber Security" },
  //   { id: "2", discipline: "Cyber Defense" },
  //   { id: "3", discipline: "Cyber Operations" },
  //   { id: "4", discipline: "Administration" },
  //   { id: "5", discipline: "Management" },
  //   { id: "6", discipline: "Marketing" },
  //   { id: "7", discipline: "Finance" },
  // ];

  // // Liste statique de pays
  // const countries = [
  //   { id: "1", code: "US", name: "United States" },
  //   { id: "2", code: "CA", name: "Canada" },
  //   { id: "3", code: "FR", name: "France" },
  //   { id: "4", code: "DE", name: "Germany" },
  //   { id: "5", code: "IN", name: "India" },
  //   { id: "6", code: "BR", name: "Brazil" },
  //   { id: "7", code: "AU", name: "Australia" },
  // ];

  const handlerSubmit = async () => {
    setIsLoading(true);
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("accessToken");

    // Vérifier que le token est présent
    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    // Vérifier que tous les champs sont remplis
    if (
      !file ||
      !title ||
      !selectedYear ||
      !author ||
      !selectedUniversity ||
      !selectedDiscipline ||
      !selectedCountry ||
      !description
    ) {
      setError("Veuillez remplir tous les champs pour continuer");
      toast.error("Veuillez remplir tous les champs pour continuer");
      setIsLoading(false);
      return;
    }

    try {
      // Étape 1 : Soumettre le fichier au format multipart/form-data
      const formData = new FormData();
      formData.append("file", file.file);

      const fileResponse = await fetch(
        // "http://192.168.1.140:3001/document/upload"
        `${getApiUrl("/document/upload")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Pas besoin de Content-Type pour FormData
          },
          body: formData, // Utiliser FormData comme corps de la requête
        }
      );

      if (!fileResponse.ok) {
        const errorData = await fileResponse.json();
        throw new Error(
          errorData.message || "Erreur lors de la soumission du fichier"
        );
        toast.error("Erreur lors de la soumission du fichier");
      }

      // console.log("Fichier soumis avec succès !", fileResponse);

      const fileData = await fileResponse.json();
      const filePath = fileData.path;

      // Étape 2 : Soumettre les autres éléments avec l'ID du fichier
      const documentResponse = await fetch(
        // "http://192.168.1.140:3001/document/submit"
        `${getApiUrl("/document/submit")}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title,
            author: author,
            description: description,
            disciplineId: selectedDiscipline,
            yearId: selectedYear,
            documentTypeId: selectedDocType, // Remplacez par la valeur appropriée
            universityId: selectedUniversity,
            countryId: selectedCountry,
            path: filePath, // Inclure l'ID du fichier
          }),
        }
      );

      if (!documentResponse.ok) {
        const errorData = await documentResponse.json();
        throw new Error(
          errorData.message ||
            "Erreur lors de la soumission des détails du document"
        );
      }

      console.log("Document et détails soumis avec succès !");
      setSelectedStep(1);
      toast.success("Document ajouté avec succès !");
    } catch (error: Error) {
      console.error("Erreur lors de la soumission :", error);
      toast.error("Erreur lors de la soumission :", error);

      setError(
        error.message || "Une erreur est survenue lors de la soumission."
      );
      toast.error(
        error.message || "Une erreur est survenue lors de la soumission."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du changement de sélection
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setSelectedCountry(event.target.value);
  };

  const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectedDocType(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDocType(e.target.value);
  };

  // Files

  const [file, setFile] = useState<FileWithPreview | null>(null); // Un seul fichier, pas un tableau
  const [isDragActive, setIsDragActive] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1, // Limite explicite à 1 fichier
    maxSize: 15 * 1024 * 1024, // 5 MB
    multiple: false, // Désactive l'upload multiple
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        // Si un fichier existe déjà, on le supprime avant d'ajouter le nouveau
        if (file) {
          URL.revokeObjectURL(file.preview);
        }

        // On prend uniquement le premier fichier (au cas où)
        const newFile = acceptedFiles[0];
        if (newFile) {
          const fileWithPreview = {
            id: uuidv4(),
            file: newFile,
            preview: URL.createObjectURL(newFile),
          };
          setFile(fileWithPreview); // Remplace l'ancien fichier
        }
        setIsDragActive(false);
      },
      [file]
    ), // Dépendance à file pour nettoyer l'ancien preview
    onDropRejected: useCallback((fileRejections: FileRejection[]) => {
      // console.log("Fichier rejeté:", fileRejections);
      setIsDragActive(false);
    }, []),
    onDragEnter: useCallback(() => {
      setIsDragActive(true);
    }, []),
    onDragLeave: useCallback(() => {
      setIsDragActive(false);
    }, []),
    onDragOver: useCallback(() => {
      setIsDragActive(true);
    }, []),
  });

  const handleRemoveFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
      setFile(null); // Supprime le fichier actuel
    }
  };

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview); // Nettoyage à la destruction du composant
      }
    };
  }, [file]);

  const handleStepChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    step: int
  ) => {
    e.preventDefault();

    if (step === 2) {
      if (!file) {
        setError("Veuillez sélectionner un fichier pour continuer");
        toast.error("Veuillez sélectionner un fichier pour continuer");
        return;
      }
      setSelectedDocType("");
      setTitle("");
      setSelectedYear("");
      setAuthor("");
      setSelectedUniversity("");
      setUniversity("");
      setSelectedDiscipline("");
      setSelectedCountry("");
      setDescription("");
    } else if (step === 3) {
      if (
        !file ||
        !title ||
        !selectedYear ||
        !author ||
        !selectedUniversity ||
        !selectedDiscipline ||
        !selectedCountry ||
        !description
      ) {
        setError("Veuillez remplir tous les champs pour continuer");
        toast.error("Veuillez remplir tous les champs pour continuer");
        return;
      }
    }
    setError("");
    setSelectedStep(step);
  };

  const fetchAllData = async () => {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("accessToken");

    // Vérifier que le token est présent
    if (!token) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    // Définir les endpoints pour chaque type de données
    const endpoints = [
      { name: "years", url: "/admin/years" },
      { name: "universities", url: "/admin/universities" },
      { name: "countries", url: "/admin/countries" },
      { name: "disciplines", url: "/admin/disciplines" },
      { name: "types", url: "/admin/document-types" },
    ];

    // Objet pour stocker les données récupérées
    const allData: Record<string, any[]> = {
      years: [],
      universities: [],
      countries: [],
      disciplines: [],
      types: [],
    };

    try {
      // Parcourir chaque endpoint et récupérer les données
      for (const endpoint of endpoints) {
        const response = await fetch(
          // `http://192.168.1.140:3001${endpoint.url}`
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

      // Retourner les données pour une utilisation ultérieure
      return allData;
    } catch (error: Error) {
      console.error("Erreur lors de la récupération des données :", error);
      toast.error("Erreur lors de la récupération des données");

      // Afficher un message d'erreur à l'utilisateur
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Une erreur inconnue est survenue.");
        toast.error("Une erreur inconnue est survenue.");
      }
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getValueById = (id: string, list: { id: string; name: string }[]) => {
    const foundItem = list.find((item) => item.id === id);
    return foundItem ? foundItem.name : "Non défini";
  };

  return (
    <section>
      <Toaster richColors position="top-right" />
      {(() => {
        switch (selectedStep) {
          // case 2:
          //   return <p></p>;
          case 2:
            return (
              <div>
                <p>Etape 2/3</p>
                <br />

                <form>
                  {/* Documents */}
                  <SelectOptionSection
                    htmlFor="type"
                    label="Type de documents : "
                    optionKey="name"
                    defaultOption="Sélectionner un document"
                    selectedOption={selectedDocType}
                    handleChange={handleDocTypeChange}
                    datas={types}
                  />

                  <br />

                  <DocInputSession
                    label="Titre du document :"
                    value={title}
                    placeholder="Veuillez renseigner le titre du document ici ..."
                    handleChange={(e) => setTitle(e.target.value)}
                    htmlFor={"1"}
                  />

                  <br />

                  <SelectOptionSection
                    htmlFor="year"
                    label="Année:"
                    optionKey="year"
                    defaultOption="Sélectionner une année"
                    selectedOption={selectedYear}
                    handleChange={(e) => setSelectedYear(e.target.value)}
                    datas={years}
                  />

                  <br />

                  <DocInputSession
                    label="Auteur:"
                    value={author}
                    placeholder="Veuillez renseigner l'auteur ..."
                    handleChange={(e) => {
                      setAuthor(e.target.value);
                    }}
                    htmlFor={"2"}
                  />

                  <br />

                  <SelectOptionSection
                    htmlFor="university"
                    label="Université: "
                    optionKey="name"
                    defaultOption="Sélectionner une université"
                    selectedOption={selectedUniversity}
                    handleChange={(e) => setSelectedUniversity(e.target.value)}
                    datas={universities}
                  />

                  <br />

                  <DocInputSession
                    label="Votre université n'est pas dans la liste ?"
                    value={author}
                    placeholder="Veuillez renseigner votre université ici ..."
                    handleChange={(e) => {
                      setAuthor(e.target.value);
                    }}
                    htmlFor={"2"}
                  />

                  <br />

                  <SelectOptionSection
                    htmlFor="discipline"
                    label="Discipline: "
                    optionKey="name"
                    defaultOption="Sélectionner une discipline"
                    selectedOption={selectedDiscipline}
                    handleChange={(e) => setSelectedDiscipline(e.target.value)}
                    datas={disciplines}
                  />

                  <br />

                  <SelectCountryOption
                    label="Pays:"
                    countries={countries}
                    defaultOption="Sélectionner un pays"
                    selectedOption={selectedCountry}
                    handleChange={handleCountryChange}
                    datas={countries}
                  />

                  <br />

                  <DocTextArea
                    label="Description:"
                    value={description}
                    placeholder="Veuillez renseigner la description ici ..."
                    handleChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    htmlFor={"3"}
                  />

                  <br />

                  <br />
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  <br />

                  <div className="px-20">
                    <button
                      className="btn btn-primary w-full"
                      type="submit"
                      onClick={(e) => handleStepChange(e, 3)}
                    >
                      Suivant
                    </button>
                  </div>

                  <br />
                  <br />
                  <div className="flex flex-row justify-between">
                    <span
                      className="bg-gray-200 rounded-full p-2 text-center"
                      onClick={(e) => setSelectedStep(selectedStep - 1)}
                    >
                      <Image
                        src={"/assets/icons/left-arrow.png"}
                        height={15}
                        width={15}
                        alt=""
                      />
                    </span>
                    <span
                      className="bg-gray-200 rounded-full p-2 text-center"
                      onClick={(e) => setSelectedStep(selectedStep + 1)}
                    >
                      <Image
                        src={"/assets/icons/right-arrow.png"}
                        height={15}
                        width={15}
                        alt=""
                      />
                    </span>
                  </div>
                  <br />
                </form>
              </div>
            );
          case 3:
            return (
              <div>
                <Toaster richColors position="top-right" />

                <p>Etape 3/3</p>
                <br />

                <div className="flex flex-row align-center gap-5">
                  <div className="text-center align-center">
                    <Image
                      src={"/assets/images/png/pdf.png"}
                      height={150}
                      width={150}
                      alt={"pdf"}
                    />
                    <p>thèse.pdf</p>
                  </div>
                  <div>
                    <h2 className="righteous text-secondary">{title}</h2>
                    <p>Type: {getValueById(selectedDocType, types)}</p>
                    <p>Année: {getValueById(selectedYear, years)}</p>
                    <p>Pays: {author}</p>
                    <p>Auteur: {author}</p>
                    <p>
                      Discipline:{" "}
                      {getValueById(selectedDiscipline, disciplines)}
                    </p>
                  </div>
                </div>
                <br />
                <br />
                <div>
                  <b className="righteous">Description : </b> {description}
                </div>

                <br />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <br />
                <div className="px-20">
                  <button
                    className="btn btn-primary w-full flex items-center justify-center"
                    type="submit"
                    onClick={handlerSubmit}
                    disabled={isLoading} // Désactiver le bouton pendant le chargement
                  >
                    {isLoading ? <ButtonLoading /> : "Soumettre"}
                  </button>
                </div>

                <br />
                <br />
                <div
                  className="flex flex-row justify-start items-start"
                  onClick={(e) => setSelectedStep(selectedStep - 1)}
                >
                  <span className="bg-gray-200 rounded-full p-2 text-center">
                    <Image
                      src={"/assets/icons/left-arrow.png"}
                      height={15}
                      width={15}
                      alt=""
                    />
                  </span>
                </div>
              </div>
            );
          default:
            return (
              <div>
                <br />

                <p>Etape 1/3</p>
                <br />
                <br />

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed py-40 ${
                    isDragActive ? "bg-gray-200" : "bg-white"
                  } p-5 text-center cursor-pointer`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Lâche le fichier ici...</p>
                  ) : (
                    <p>
                      Glisse-dépose un fichier (PDF) ici, ou clique pour
                      sélectionner (max 15MB)
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  {file && (
                    <ul className="list-none p-0">
                      <li className="my-2 flex items-center">
                        <span className="mr-2">
                          {file.file.name} -{" "}
                          {(file.file.size / 1024).toFixed(2)} KB
                        </span>
                        <a
                          href={file.preview}
                          download={file.file.name}
                          className="mr-2 text-blue-500"
                        >
                          Télécharger
                        </a>
                        <button
                          onClick={handleRemoveFile}
                          className="text-red-500 border-none bg-none cursor-pointer"
                        >
                          Supprimer
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                <br />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <br />
                <div className="px-20">
                  <button
                    className="btn btn-primary w-full"
                    type="button"
                    onClick={(e) => handleStepChange(e, 2)}
                  >
                    Suivant
                  </button>
                </div>
                <br />
                <br />
                <div className="flex flex-row justify-end items-end">
                  <span
                    className="bg-gray-200 rounded-full p-2 text-center"
                    onClick={(e) => setSelectedStep(selectedStep + 1)}
                  >
                    <Image
                      src={"/assets/icons/right-arrow.png"}
                      height={15}
                      width={15}
                      alt=""
                    />
                  </span>
                </div>
              </div>
            );
        }
      })()}
    </section>
  );

  return <section></section>;
};

export default CountrySelect;
