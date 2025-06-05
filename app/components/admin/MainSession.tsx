import React, { useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import Loading from "../Loading/Loading";
import { getApiUrl } from "@/app/lib/config";
import DataTable from "./DataTable/DataTable";
import SystemYears from "@/app/includes/system/SystemYears";
import SystemUniversity from "@/app/includes/system/SystemUniversity";
import SystemCountries from "@/app/includes/system/SystemCountries";
import SystemDiscipline from "@/app/includes/system/SystemDiscipline";
import DocumentsMain from "@/app/includes/docs/DocumentsMain";
import UsersMainItems from "@/app/includes/users/UsersMainItems";

type MainSessionProps = {
  selectedItem: string;
};

const MainSession: React.FC<MainSessionProps> = ({ selectedItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState("");
  const [university, setUniversity] = useState("");
  const [country, setCountry] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [users, setUsers] = useState("");
  const [error, setError] = useState("");
  const [datas, setDatas] = useState<any[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(
        `${getApiUrl(`/user/connected/${userId}`)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'utilisateur");
      }

      const user = await response.json();
      setUsername(user.username);
      setEmail(user.email);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      toast.error("Erreur lors de la récupération");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    window.location.href = "/pages/authentication/login";
  };

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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Vous devez être connecté pour effectuer cette action.");
      setIsLoading(false);
      return;
    }

    let inputValue: string | number = "";
    let fieldName = "";

    switch (selectedItem) {
      case "Années":
        inputValue = year;
        fieldName = "year";
        break;
      case "Universités":
        inputValue = university;
        fieldName = "name";
        break;
      case "Pays":
        inputValue = country;
        fieldName = "name";
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

    if (!inputValue.toString().trim()) {
      setError("Veuillez remplir le champ");
      return;
    }

    if (selectedItem === "Années") {
      const yearNumber = parseInt(inputValue, 10);
      if (isNaN(yearNumber)) {
        setError("L'année doit être un nombre valide.");
        setIsLoading(false);
        return;
      }
      inputValue = yearNumber;
    }

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

    const apiUrl = `${getApiUrl(`${endpoint}`)}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [fieldName]: inputValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la soumission");
      }

      setYear("");
      setUniversity("");
      setCountry("");
      setDiscipline("");
      setError("");

      setIsModalOpen(false);
      toast.success(selectedItem + " soumis avec succès");
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      toast.error("Erreur lors de la soumission");

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
    <div className="main-session">
      <Toaster richColors position="top-right" />
      
      {/* Header avec profil */}
      <div className="flex justify-between items-center mb-6">
        {selectedItem && selectedItem !== "Documents" ? (
          <h1 className="righteous text-2xl font-bold">
            Créer de nouvelles catégories
          </h1>
        ) : (
          <h1 className="regular text-2xl font-bold">
            Vérifiez et soumettez votre document
          </h1>
        )}
        
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <CircleUserRound className="text-gray-700" size={24} />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Mon Profil</h3>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                  <p className="font-medium">{username || "Chargement..."}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{email || "Chargement..."}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedItem && selectedItem !== "Documents" && (
        <div className="flex justify-between px-6 mb-4">
          <h3 className="quicksand-bold">Liste des {selectedItem}</h3>
          {selectedItem !== "Utilisateurs" && (
            <button onClick={openModal}>
              <Image
                src={"/assets/icons/plus.png"}
                alt="Ajouter"
                height={20}
                width={20}
              />
            </button>
          )}
        </div>
      )}

      {/* Modale d'ajout */}
      {isModalOpen && (
        <div
          data-dialog-backdrop="dialog"
          onClick={closeModal}
          className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            data-dialog="dialog"
            className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
          >
            <div className="flex items-center pb-4">
              <b className="righteous text-xl text-slate-800">
                {selectedItem === "Années" && "Créer une nouvelle année"}
                {selectedItem === "Universités" && "Créer une nouvelle université"}
                {selectedItem === "Disciplines" && "Créer une nouvelle discipline"}
                {selectedItem === "Pays" && "Créer un nouveau pays"}
              </b>
            </div>

            <div className="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light">
              {error && <p className="text-red-500 text-center">{error}</p>}
              <br />
              <input
                type={
                  selectedItem === "Années" ? "number" : "text"
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

      {renderContent()}
    </div>
  );
};

export default MainSession;