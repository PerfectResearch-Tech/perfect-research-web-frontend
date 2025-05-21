// export default MainSession;

import React, { useEffect, useState } from "react";
import SystemYears from "@/app/includes/system/SystemYears";
import SystemUniversity from "@/app/includes/system/SystemUniversity";
import SystemCountries from "@/app/includes/system/SystemCountries";
import SystemDiscipline from "@/app/includes/system/SystemDiscipline";
import DocumentsMain from "@/app/includes/docs/DocumentsMain";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import Loading from "../Loading/Loading";
import { getApiUrl } from "@/app/lib/config";
import DataTable from "./DataTable/DataTable";
import UsersMainItems from "@/app/includes/users/UsersMainItems";

type MainSessionProps = {
  selectedItem: string;
};

const MainSession: React.FC<MainSessionProps> = ({ selectedItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [discipline, setDiscipline] = useState<string>("");
  const [users, setUsers] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [datas, setDatas] = useState<any[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    let endpoint = "";
    switch (selectedItem) {
      case "Années":
        endpoint = "/admin/years";
        break;
      case "Universités":
        endpoint = "/admin/universities";
        break;
      case "Pays":
        endpoint = "/admin/countries";
        break;
      case "Disciplines":
        endpoint = "/admin/disciplines";
        break;
      case "Utilisateurs":
        endpoint = "/admin/users";
        break;
      default:
        setError("Aucune option valide sélectionnée");
        return;
    }

    const apiUrl = `${getApiUrl(endpoint)}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la récupération");
      }

      const datas = await response.json();
      setDatas(datas);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      toast.error("Erreur lors de la récupération");
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      fetchData();
    }
  }, [selectedItem]);

  const handlerSubmit = async () => {
    setIsLoading(true);

    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("accessToken");

    // Vérifier que le token est présent
    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      setIsLoading(false);

      return;
    }

    // Déterminer la valeur de l'input et le nom du champ en fonction de selectedItem
    let inputValue: string | number = "";
    let fieldName = "";

    switch (selectedItem) {
      case "Années":
        inputValue = year;
        fieldName = "year"; // Champ attendu par le backend pour les années
        break;
      case "Universités":
        inputValue = university;
        fieldName = "name"; // Champ attendu par le backend pour les universités
        break;
      case "Pays":
        inputValue = country;
        fieldName = "name"; // Champ attendu par le backend pour les pays
        break;
      case "Disciplines":
        inputValue = discipline;
        fieldName = "name";
        break;
      case "Utilisateurs":
        inputValue = users;
        fieldName = "name";
        break;
      default:
        setError("Aucune option valide sélectionnée");
        return;
    }

    // Vérifier que l'input n'est pas vide
    if (!inputValue.toString().trim()) {
      setError("Veuillez remplir le champ");
      return;
    }

    // Si c'est une année, convertir la valeur en nombre entier
    if (selectedItem === "Années") {
      const yearNumber = parseInt(inputValue, 10);
      if (isNaN(yearNumber)) {
        setError("L'année doit être un nombre valide.");
        setIsLoading(false);
        return;
      }
      inputValue = yearNumber; // Convertir en nombre entier
    }

    // Déterminer l'URL de l'API en fonction de selectedItem
    let endpoint = "";
    switch (selectedItem) {
      case "Années":
        endpoint = "/admin/year";
        break;
      case "Universités":
        endpoint = "/admin/university";
        break;
      case "Pays":
        endpoint = "/admin/country";
        break;
      case "Disciplines":
        endpoint = "/admin/discipline";
        break;
      case "Utilisateurs":
        endpoint = "/admin/users";
        break;
      default:
        setError("Aucune option valide sélectionnée");
        return;
    }

    // Construire l'URL complète avec l'adresse IP
    const apiUrl = `${getApiUrl(`${endpoint}`)}`;

    try {
      // Envoyer la requête POST avec le token dans les en-têtes
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
        },
        body: JSON.stringify({ [fieldName]: inputValue }), // Utiliser le nom du champ dynamique
      });

      // Vérifier si la requête a réussi
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la soumission");
      }

      // Afficher un message de succès
      // console.log(`${selectedItem} ajouté(e) avec succès !`);

      // Réinitialiser les états après une soumission réussie
      setYear("");
      setUniversity("");
      setCountry("");
      setDiscipline("");
      setError("");

      // Fermer la modale après la soumission
      setIsModalOpen(false);
      toast.success(selectedItem + " soumis avec succès");
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      toast.error("Erreur lors de la soumission");

      // Afficher un message d'erreur à l'utilisateur
      if (error instanceof Error) {
        setError(
          error.message || "Une erreur est survenue lors de la soumission."
        );
      } else {
        setError("Une erreur inconnue est survenue.");
      }
    } finally {
      setIsLoading(false);
      fetchData();
    }
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Documents":
        return <DocumentsMain />;
      case "Années":
        return isLoading ? (
          <Loading />
        ) : (
          <div>
            <DataTable
              columns={[
                { key: "year", label: "Année", sortable: true },
                { key: "actions", label: "Actions" },
              ]}
              data={datas}
              renderRow={(year) => (
                <>
                  <td>{year.year}</td>
                  <td>
                    <SystemYears
                      id={year.id}
                      year={year.year}
                      fetchData={fetchData}
                    />
                  </td>
                </>
              )}
            />
          </div>
        );

      case "Universités":
        return isLoading ? (
          <Loading />
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Université", sortable: true },
              { key: "actions", label: "Actions" },
            ]}
            data={datas}
            renderRow={(university) => (
              <>
                <td>{university.name}</td>
                <td>
                  <SystemUniversity
                    id={university.id}
                    name={university.name}
                    fetchData={fetchData}
                  />
                </td>
              </>
            )}
          />
        );
      case "Disciplines":
        return isLoading ? (
          <Loading />
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Discipline", sortable: true },
              { key: "actions", label: "Actions" },
            ]}
            data={datas}
            renderRow={(discipline) => (
              <>
                <td>{discipline.name}</td>
                <td>
                  <SystemDiscipline
                    id={discipline.id}
                    name={discipline.name}
                    fetchData={fetchData}
                  />
                </td>
              </>
            )}
          />
        );
      case "Pays":
        return isLoading ? (
          <Loading />
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Pays", sortable: true },
              { key: "actions", label: "Actions" },
            ]}
            data={datas}
            renderRow={(country) => (
              <>
                <td>{country.name}</td>
                <td>
                  <SystemCountries
                    id={country.id}
                    name={country.name}
                    fetchData={fetchData}
                  />
                </td>
              </>
            )}
          />
        );
      case "Utilisateurs":
        return isLoading ? (
          <Loading />
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Nom d'utilisateurs", sortable: true },
              { key: "email", label: "Email", sortable: true },
              { key: "role", label: "Rôle", sortable: true },
              { key: "status", label: "Status", sortable: true },
              { key: "lastLogin", label: "Dernière connexion", sortable: true },
              { key: "actions", label: "Actions" },
            ]}
            data={datas}
            renderRow={(user) => (
              <>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.active ? (
                    <span className="text-green-500">Activé</span>
                  ) : (
                    <span className="text-red-500">Bloqué</span>
                  )}
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <UsersMainItems data={user} fetchData={fetchData} />
                </td>
              </>
            )}
          />
        );
      default:
        return <div>Sélectionner une option pour afficher les détails</div>;
    }
  };

  return (
    <div>
      <div className="main-session">
        <Toaster richColors position="top-right" />

        {selectedItem && selectedItem !== "Documents" ? (
          <div>
            <h1 className="righteous text-2xl font-bold mb-4">
              Créer de nouvelles catégories
            </h1>
            <div className="flex justify-between px-6">
              <h3 className="quicksand-bold">Liste des {selectedItem}</h3>:
              {selectedItem !== "Utilisateurs" && (
                <button onClick={openModal}>
                  <Image
                    src={"/assets/icons/plus.png"}
                    alt="google"
                    height={20}
                    width={20}
                  />
                </button>
              )}
              {/* Modale */}
              {isModalOpen && (
                <div
                  data-dialog-backdrop="dialog"
                  onClick={closeModal}
                  className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
                >
                  <div
                    onClick={(e) => e.stopPropagation()} // Pour empêcher la fermeture en cliquant à l'intérieur
                    data-dialog="dialog"
                    className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
                      <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
                        <b className="righteous">
                          {selectedItem === "Années" &&
                            "Créer une nouvelle année"}
                          {selectedItem === "Universités" &&
                            "Créer une nouvelle université"}
                          {selectedItem === "Disciplines" &&
                            "Créer une nouvelle discipline"}
                          {selectedItem === "Country" &&
                            "Créer un nouveau pays"}
                        </b>
                      </div>
                    </div>

                    <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
                      {error && (
                        <p className="text-red-500 text-center">{error}</p>
                      )}
                      <br />
                      <input
                        type={
                          selectedItem === "Années"
                            ? "number"
                            : selectedItem === "Universités" ||
                              selectedItem === "Disciplines" ||
                              selectedItem === "Country"
                            ? "text"
                            : "text" // Valeur par défaut, au cas où selectedItem serait autre chose
                        }
                        className="w-full p-4 border"
                        placeholder={
                          selectedItem === "Années"
                            ? "Veuillez saisir l'année ici"
                            : selectedItem === "Universités"
                            ? "Veuillez saisir l'université ici"
                            : selectedItem === "Disciplines"
                            ? "Veuillez saisir la discipline ici"
                            : selectedItem === "Pays"
                            ? "Veuillez saisir le pays ici"
                            : selectedItem === "Utilisateurs"
                            ? "Veuillez saisir l'utilisateur ici"
                            : "Veuillez saisir l'information ici"
                        }
                        value={
                          selectedItem === "Années"
                            ? year
                            : selectedItem === "Universités"
                            ? university
                            : selectedItem === "Disciplines"
                            ? discipline
                            : selectedItem === "Pays"
                            ? country
                            : selectedItem === "Utilisateurs"
                            ? users
                            : ""
                        }
                        onChange={(e) =>
                          selectedItem === "Années"
                            ? setYear(e.target.value)
                            : selectedItem === "Universités"
                            ? setUniversity(e.target.value)
                            : selectedItem === "Disciplines"
                            ? setDiscipline(e.target.value)
                            : selectedItem === "Pays"
                            ? setCountry(e.target.value)
                            : selectedItem === "Utilisateurs"
                            ? setUsers(e.target.value)
                            : null
                        }
                      />
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
                      <button
                        onClick={closeModal}
                        className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handlerSubmit}
                        className="rounded-md btn btn-primary py-2 px-4 border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                        type="button"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="regular text-2xl font-bold mb-4">
              Vérifiez et soumettez votre document 
            </h1>
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default MainSession;

// import DocumentsMain from "@/app/includes/docs/DocumentsMain";
// import SystemCountries from "@/app/includes/system/SystemCountries";
// import SystemDiscipline from "@/app/includes/system/SystemDiscipline";
// import SystemUniversity from "@/app/includes/system/SystemUniversity";
// import SystemYears from "@/app/includes/system/SystemYears";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React, { use, useEffect, useState } from "react";
// import { toast, Toaster } from "sonner";
// import Loading from "../Loading/Loading";
// import { getApiUrl } from "@/app/lib/config";

// type MainSessionProps = {
//   selectedItem: string;
// };

// const MainSession: React.FC<MainSessionProps> = ({ selectedItem }) => {
//   // État pour contrôler l'affichage de la modale
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [year, setYear] = useState<string>("");
//   const [university, setUniversity] = useState<string>("");
//   const [country, setCountry] = useState<string>("");
//   const [discipline, setDiscipline] = useState<string>("");
//   const [error, setError] = useState<string>("");
//   const [datas, setDatas] = useState<any[]>([]);

//   // Fonction pour ouvrir la modale
//   const openModal = () => setIsModalOpen(true);

//   // Fonction pour fermer la modale
//   const closeModal = () => setIsModalOpen(false);

//   // useEffect(() => {
//   //   fetchData();
//   // }, []);

//   const fetchData = async () => {
//     const token = localStorage.getItem("accessToken");

//     if (!token) {
//       setError("Vous devez être connecté pour effectuer cette action.");
//       return;
//     }

//     let endpoint = "";
//     switch (selectedItem) {
//       case "Années":
//         endpoint = "/admin/years";
//         break;
//       case "Universités":
//         endpoint = "/admin/universities";
//         break;
//       case "Pays":
//         endpoint = "/admin/countries";
//         break;
//       case "Disciplines":
//         endpoint = "/admin/disciplines";
//         break;
//       default:
//         setError("Aucune option valide sélectionnée");
//         return;
//     }

//     const apiUrl = `${getApiUrl(endpoint)}`;

//     try {
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Erreur lors de la récupération");
//       }

//       const datas = await response.json();
//       // console.log("Données récupérées :", datas);

//       // Mettre à jour l'état avec les données reçues
//       setDatas(datas);
//     } catch (error) {
//       console.error("Erreur lors de la récupération :", error);
//       toast.error("Erreur lors de la récupération");
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Une erreur inconnue est survenue."
//       );
//     }
//   };

//   useEffect(() => {
//     if (selectedItem) {
//       fetchData();
//     }
//   }, [selectedItem]); // Exécute fetchData seulement quand selectedItem change

//   const handlerSubmit = async () => {
//     setIsLoading(true);

//     // Récupérer le token depuis le localStorage
//     const token = localStorage.getItem("accessToken");

//     // Vérifier que le token est présent
//     if (!token) {
//       setError("Vous devez être connecté pour effectuer cette action.");
//       setIsLoading(false);

//       return;
//     }

//     // Déterminer la valeur de l'input et le nom du champ en fonction de selectedItem
//     let inputValue: string | number = "";
//     let fieldName = "";

//     switch (selectedItem) {
//       case "Années":
//         inputValue = year;
//         fieldName = "year"; // Champ attendu par le backend pour les années
//         break;
//       case "Universités":
//         inputValue = university;
//         fieldName = "name"; // Champ attendu par le backend pour les universités
//         break;
//       case "Pays":
//         inputValue = country;
//         fieldName = "name"; // Champ attendu par le backend pour les pays
//         break;
//       case "Disciplines":
//         inputValue = discipline;
//         fieldName = "name"; // Champ attendu par le backend pour les disciplines
//         break;
//       default:
//         setError("Aucune option valide sélectionnée");
//         return;
//     }

//     // Vérifier que l'input n'est pas vide
//     if (!inputValue.toString().trim()) {
//       setError("Veuillez remplir le champ");
//       return;
//     }

//     // Si c'est une année, convertir la valeur en nombre entier
//     if (selectedItem === "Années") {
//       const yearNumber = parseInt(inputValue, 10);
//       if (isNaN(yearNumber)) {
//         setError("L'année doit être un nombre valide.");
//         setIsLoading(false);
//         return;
//       }
//       inputValue = yearNumber; // Convertir en nombre entier
//     }

//     // Déterminer l'URL de l'API en fonction de selectedItem
//     let endpoint = "";
//     switch (selectedItem) {
//       case "Années":
//         endpoint = "/admin/year";
//         break;
//       case "Universités":
//         endpoint = "/admin/university";
//         break;
//       case "Pays":
//         endpoint = "/admin/country";
//         break;
//       case "Disciplines":
//         endpoint = "/admin/discipline";
//         break;
//       default:
//         setError("Aucune option valide sélectionnée");
//         return;
//     }

//     // Construire l'URL complète avec l'adresse IP
//     const apiUrl = `${getApiUrl(`${endpoint}`)}`;

//     try {
//       // Envoyer la requête POST avec le token dans les en-têtes
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
//         },
//         body: JSON.stringify({ [fieldName]: inputValue }), // Utiliser le nom du champ dynamique
//       });

//       // Vérifier si la requête a réussi
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Erreur lors de la soumission");
//       }

//       // Afficher un message de succès
//       // console.log(`${selectedItem} ajouté(e) avec succès !`);

//       // Réinitialiser les états après une soumission réussie
//       setYear("");
//       setUniversity("");
//       setCountry("");
//       setDiscipline("");
//       setError("");

//       // Fermer la modale après la soumission
//       setIsModalOpen(false);
//       toast.success(selectedItem + " soumis avec succès");
//     } catch (error) {
//       console.error("Erreur lors de la soumission :", error);
//       toast.error("Erreur lors de la soumission");

//       // Afficher un message d'erreur à l'utilisateur
//       if (error instanceof Error) {
//         setError(
//           error.message || "Une erreur est survenue lors de la soumission."
//         );
//       } else {
//         setError("Une erreur inconnue est survenue.");
//       }
//     } finally {
//       setIsLoading(false);
//       fetchData();
//     }
//   };

//   const renderContent = () => {
//     switch (selectedItem) {
//       case "Documents":
//         return (
//           <div>
//             <DocumentsMain />
//           </div>
//         );
//       case "Années":
//         return (
//           <div>
//             {datas.map((year: any) => (
//               <SystemYears
//                 key={year.id}
//                 id={year.id}
//                 year={year.year}
//                 fetchData={fetchData}
//               />
//             ))}
//           </div>
//         );
//       case "Universités":
//         return (
//           <div>
//             {datas.map((university: any) => (
//               <SystemUniversity
//                 key={university.id}
//                 id={university.id}
//                 name={university.name}
//                 fetchData={fetchData}
//               />
//             ))}
//           </div>
//         );
//       case "Disciplines":
//         return (
//           <div>
//             {datas.map((discipline: any) => (
//               <SystemDiscipline
//                 key={discipline.id}
//                 id={discipline.id}
//                 name={discipline.name}
//                 fetchData={fetchData}
//               />
//             ))}
//           </div>
//         );
//       case "Pays":
//         return (
//           <div>
//             {datas.map((country: any) => (
//               <SystemCountries
//                 key={country.id}
//                 id={country.id}
//                 name={country.name}
//                 fetchData={fetchData}
//               />
//             ))}
//           </div>
//         );
//       default:
//         return <div>Sélectionner une option pour afficher les détails</div>;
//     }
//   };

//   return (
//     <div>
//       {" "}
//       {isLoading ? (
//         <Loading />
//       ) : (
//         <div className="main-session">
//           <Toaster richColors position="top-right" />

//           {selectedItem && selectedItem !== "Documents" ? (
//             <div>
//               {" "}
//               <h1 className="righteous text-2xl font-bold mb-4">
//                 Créer de nouvelles categories
//               </h1>{" "}
//               <div className="flex justify-between">
//                 <h3 className="quicksand-bold">Liste des {selectedItem}</h3>

//                 <button onClick={openModal}>
//                   <Image
//                     src={"/assets/icons/plus.png"}
//                     alt="google"
//                     height={20}
//                     width={20}
//                   />
//                 </button>

//                 {/* Modale */}
//                 {isModalOpen && (
//                   <div
//                     data-dialog-backdrop="dialog"
//                     onClick={closeModal}
//                     className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
//                   >
//                     <div
//                       onClick={(e) => e.stopPropagation()} // Pour empêcher la fermeture en cliquant à l'intérieur
//                       data-dialog="dialog"
//                       className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
//                     >
//                       <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
//                         <div className="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800">
//                           <b className="righteous">
//                             {selectedItem === "Années" &&
//                               "Créer une nouvelle année"}
//                             {selectedItem === "Universités" &&
//                               "Créer une nouvelle université"}
//                             {selectedItem === "Disciplines" &&
//                               "Créer une nouvelle discipline"}
//                             {selectedItem === "Country" &&
//                               "Créer un nouveau pays"}
//                           </b>
//                         </div>
//                       </div>

//                       <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
//                         {error && (
//                           <p className="text-red-500 text-center">{error}</p>
//                         )}
//                         <br />
//                         <input
//                           type={
//                             selectedItem === "Années"
//                               ? "number"
//                               : selectedItem === "Universités" ||
//                                 selectedItem === "Disciplines" ||
//                                 selectedItem === "Country"
//                               ? "text"
//                               : "text" // Valeur par défaut, au cas où selectedItem serait autre chose
//                           }
//                           className="w-full p-4 border"
//                           placeholder={
//                             selectedItem === "Années"
//                               ? "Veuillez saisir l'année ici"
//                               : selectedItem === "Universités"
//                               ? "Veuillez saisir l'université ici"
//                               : selectedItem === "Disciplines"
//                               ? "Veuillez saisir la discipline ici"
//                               : selectedItem === "Pays"
//                               ? "Veuillez saisir le pays ici"
//                               : "Veuillez saisir l'information ici"
//                           }
//                           value={
//                             selectedItem === "Années"
//                               ? year
//                               : selectedItem === "Universités"
//                               ? university
//                               : selectedItem === "Disciplines"
//                               ? discipline
//                               : selectedItem === "Pays"
//                               ? country
//                               : ""
//                           }
//                           onChange={(e) =>
//                             selectedItem === "Années"
//                               ? setYear(e.target.value)
//                               : selectedItem === "Universités"
//                               ? setUniversity(e.target.value)
//                               : selectedItem === "Disciplines"
//                               ? setDiscipline(e.target.value)
//                               : selectedItem === "Pays"
//                               ? setCountry(e.target.value)
//                               : null
//                           }
//                         />
//                       </div>

//                       <div className="flex shrink-0 flex-wrap items-center pt-4 justify-end">
//                         <button
//                           onClick={closeModal}
//                           className="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
//                           type="button"
//                         >
//                           Annuler
//                         </button>
//                         <button
//                           onClick={handlerSubmit}
//                           className="rounded-md btn btn-primary py-2 px-4 border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
//                           type="button"
//                         >
//                           Ajouter
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div>
//               <h1 className="righteous text-2xl font-bold mb-4">
//                 Vérifiez et soumettez votre document
//               </h1>
//             </div>
//           )}
//           {renderContent()}
//         </div>
//       )}
//     </div>
//   );
// };
