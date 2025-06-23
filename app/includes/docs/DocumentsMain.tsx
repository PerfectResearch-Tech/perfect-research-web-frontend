import DocInputSession from "@/app/components/generals/inputs/DocInputSession";
import {
  SelectCountryOption,
  SelectOptionSection,
} from "@/app/components/generals/select/SelectOptionSection";
import DocTextArea from "@/app/components/generals/textarea/DocTextArea";
import ButtonLoading from "@/app/components/Loading/ButtonLoading";
import { getApiUrl } from "@/app/lib/config";
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
  sender: "USER";
}

interface DocumentsMainProps {
  companyId: string; // Ajout de la prop companyId
}

const DocumentsMain: React.FC<DocumentsMainProps> = ({ companyId }) => {
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
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const router = useRouter();

  // Récupération des données pour les sélecteurs
  const fetchAllData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("[DEBUG] Aucun token trouvé pour fetchAllData");
      toast.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    const endpoints = [
      { name: "years", url: "/admin/years" },
      { name: "universities", url: "/admin/universities" },
      { name: "countries", url: "/admin/countries" },
      { name: "disciplines", url: "/admin/disciplines" },
      { name: "types", url: "/admin/document-types" },
    ];

    const allData: Record<string, any[]> = {
      years: [],
      universities: [],
      countries: [],
      disciplines: [],
      types: [],
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
          console.log("[DEBUG] Erreur pour endpoint", endpoint.url, ":", response.status);
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
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      toast.error("Erreur lors de la récupération des données");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Gestion du téléversement du fichier
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 15 * 1024 * 1024,
    multiple: false,
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        if (file) {
          URL.revokeObjectURL(file.preview);
        }
        const newFile = acceptedFiles[0];
        if (newFile) {
          const fileWithPreview = {
            id: uuidv4(),
            file: newFile,
            preview: URL.createObjectURL(newFile),
            sender: "USER",
          };
          setFile(fileWithPreview);
        }
        setIsDragActive(false);
      },
      [file]
    ),
    onDropRejected: useCallback(() => {
      setIsDragActive(false);
      toast.error("Fichier non accepté. Veuillez uploader un fichier PDF, DOC ou DOCX de 15 Mo max.");
    }, []),
    onDragEnter: useCallback(() => setIsDragActive(true), []),
    onDragLeave: useCallback(() => setIsDragActive(false), []),
    onDragOver: useCallback(() => setIsDragActive(true), []),
  });

  const handleRemoveFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
      setFile(null);
    }
  };

  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const handlerSubmit = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      toast.error("Vous devez être connecté pour effectuer cette action.");
      setIsLoading(false);
      return;
    }

    if (!companyId) {
      console.log("[DEBUG] companyId est vide dans handlerSubmit");
      setError("L'identifiant de l'entreprise est requis.");
      toast.error("L'identifiant de l'entreprise est requis.");
      setIsLoading(false);
      return;
    }

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
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("companyId", companyId); // companyId dans formData

      console.log("[DEBUG] Envoi de la requête /document/upload avec companyId:", companyId);
      const fileResponse = await fetch(`${getApiUrl("/document/upload")}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Company-Id": companyId, // En-tête pour compatibilité
        },
        body: formData,
      });

      if (!fileResponse.ok) {
        let errorData;
        try {
          errorData = await fileResponse.json();
        } catch (jsonError) {
          console.error("[DEBUG] Erreur lors du parsing de la réponse d'erreur:", jsonError);
          throw new Error("Erreur lors de la soumission du fichier: réponse non-JSON");
        }
        console.log("[DEBUG] Réponse d'erreur de /document/upload:", errorData);
        throw new Error(errorData.message || "Erreur lors de la soumission du fichier");
      }

      const fileData = await fileResponse.json();
      console.log("[DEBUG] Réponse de /document/upload:", fileData);
      const filePath = fileData.path;

      const documentResponse = await fetch(`${getApiUrl("/document/submit")}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Company-Id": companyId,
        },
        body: JSON.stringify({
          title,
          author,
          description,
          disciplineId: selectedDiscipline,
          yearId: selectedYear,
          documentTypeId: selectedDocType,
          universityId: selectedUniversity,
          countryId: selectedCountry,
          path: filePath,
          companyId,
        }),
      });

      if (!documentResponse.ok) {
        const errorData = await documentResponse.json();
        console.log("[DEBUG] Réponse d'erreur de /document/submit:", errorData);
        throw new Error(errorData.message || "Erreur lors de la soumission des détails du document");
      }

      console.log("Document et détails soumis avec succès !");
      setSelectedStep(1);
      toast.success("Document ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setError(error.message || "Une erreur est survenue lors de la soumission.");
      toast.error(error.message || "Une erreur est survenue lors de la soumission.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setSelectedCountry(event.target.value);
  };

  const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectedDocType(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSelectedYear(e.target.value);
  };

  const handleStepChange = (
    e: React.MouseEvent<HTMLButtonElement>,
    step: number
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

  const getValueById = (id: string, list: { id: string; name: string }[]) => {
    const foundItem = list.find((item) => item.id === id);
    return foundItem ? foundItem.name : "Non défini";
  };

  return (
    <section>
      <Toaster richColors position="top-right" />
      {(() => {
        switch (selectedStep) {
          case 2:
            return (
              <div>
                <p>Étape 2/3</p>
                <br />
                <form>
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
                    handleChange={handleYearChange}
                    datas={years}
                  />
                  <br />
                  <DocInputSession
                    label="Auteur"
                    value={author}
                    placeholder="Veuillez renseigner l'auteur ..."
                    handleChange={(e) => setAuthor(e.target.value)}
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
                    value={university}
                    placeholder="Veuillez renseigner votre université ici ..."
                    handleChange={(e) => setUniversity(e.target.value)}
                    htmlFor={"university"}
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
                    handleChange={(e) => setDescription(e.target.value)}
                    htmlFor={"3"}
                  />
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
                <p>Étape 3/3</p>
                <br />
                <div className="flex flex-row align-center gap-5">
                  <div className="text-center align-center">
                    <Image
                      src={"/assets/images/png/pdf.png"}
                      height={150}
                      width={150}
                      alt={"pdf"}
                    />
                    <p>{file?.file.name || "thèse.pdf"}</p>
                  </div>
                  <div>
                    <h2 className="righteous text-secondary">{title}</h2>
                    <p>Type: {getValueById(selectedDocType, types)}</p>
                    <p>Année: {getValueById(selectedYear, years)}</p>
                    <p>Pays: {getValueById(selectedCountry, countries)}</p>
                    <p>Auteur: {author}</p>
                    <p>Discipline: {getValueById(selectedDiscipline, disciplines)}</p>
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
                    disabled={isLoading || !companyId}
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
                <p>Étape 1/3</p>
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
                      sélectionner (max 15 Mo)
                    </p>
                  )}
                </div>
                <div className="mt-5">
                  {file && (
                    <ul className="list-none p-0">
                      <li className="my-2 flex items-center">
                        <span className="mr-2">
                          {file.file.name} - {(file.file.size / 1024).toFixed(2)} Ko
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
};

export default DocumentsMain;