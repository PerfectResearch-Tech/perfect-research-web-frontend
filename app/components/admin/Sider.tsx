"use client";

import React, { useEffect, useState } from "react";
import "./adminItems.css"; // Votre fichier CSS
import {
  FaFile,
  FaCogs,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
  FaUser,
   FaSearch,
     FaFileUpload,
   
} from "react-icons/fa"; // Ajout de FaBars et FaTimes
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getApiUrl } from "@/app/lib/config";
import { MessageSquareText } from "lucide-react";

const Sider = ({ selectedItem, setSelectedItem }: any) => {
  const [isSystemOpen, setIsSystemOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // État pour la sidebar sur mobile
  const router = useRouter();

  // Fonction pour ouvrir la modale
  const openModal = () => setIsModalOpen(true);

  // Fonction pour fermer la modale
  const closeModal = () => setIsModalOpen(false);

  // Sélection d’un item et fermeture de la sidebar sur mobile
  const handleSelection = (item: string) => {
    setSelectedItem(item);
    setIsSidebarOpen(false); // Ferme la sidebar sur mobile après sélection
  };

  const toggleSystemMenu = () => {
    setIsSystemOpen(!isSystemOpen);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token) {
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

  useEffect(() => {
    if (localStorage.getItem("isAdmin")) {
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    router.push("/pages/authentication/login");
  };


const SidebarButton: React.FC<{
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}> = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700"
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </button>
);




  return (
    <>
      {/* Bouton hamburger pour mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-primary bg-tertiary-color p-2 rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <section
        className={`sider-bar fixed top-0 left-0 h-screen w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-80 md:min-h-screen md:shadow-lg flex flex-col justify-between px-6 py-8`} 
      >



        <ul className="space-y-4">
          <li>
            <h2 className="black text-center text-3xl py-4 text-primary ">
              Admin
            </h2>
          </li>

          <SidebarButton
                  icon={<MessageSquareText size={15} />}
                  text="Commencer un chat"
                  onClick={() => router.push("/pages/perfect/chat")}
                />
                <SidebarButton
                  icon={<FaFileUpload size={14} />}
                  text="Rechercher un document"
                  onClick={() => router.push("/pages/perfect/research")}
                />


          {/* Menu Documents */}
          <li>
            <div
              className={`sider-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-black hover:bg-tertiary-color hover:text-white`}
              onClick={() => handleSelection("Documents")}
            >
              <FaFile className="text-black transition-all duration-200 text-lg" />
              <span className="text-black transition-all duration-200 text-lg">
                Documents
              </span>
            </div>
          </li>

          {/* Menu Système */}
          {isAdmin && (
            <ul>
              <li>
                <div
                  className={`sider-item flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-black hover:bg-tertiary-color hover:text-white`}
                  onClick={toggleSystemMenu}
                >
                  <div className="flex items-center gap-3">
                    <FaCogs className="text-black transition-all duration-200 text-lg" />
                    <span className="text-black transition-all duration-200 text-lg">
                      Système
                    </span>
                  </div>
                  {isSystemOpen ? (
                    <FaChevronUp className="text-black transition-all duration-200 text-lg" />
                  ) : (
                    <FaChevronDown className="text-black transition-all duration-200 text-lg" />
                  )}
                </div>

                {/* Sous-menus de "Système" */}
                {isSystemOpen && (
                  <ul className="space-y-2 mt-2 pl-8">
                    {["Années", "Universités", "Disciplines", "Pays"].map(
                      (item) => (
                        <li key={item}>
                          <div
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-tertiary-color hover:text-primary`}
                            onClick={() => handleSelection(item)}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                selectedItem === item
                                  ? "bg-primary"
                                  : "bg-transparent"
                              }`}
                            />
                            <span
                              className={`text-lg ${
                                selectedItem === item ? "text-primary" : ""
                              }`}
                            >
                              {item}
                            </span>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>

              <li>
                <div
                  className={`sider-item flex items-center gap-3 px-4 py-3 my-4 rounded-lg transition-all duration-200 cursor-pointer text-black hover:bg-tertiary-color hover:text-white`}
                  onClick={() => handleSelection("Utilisateurs")}
                >
                  <FaUser className="text-black transition-all duration-200 text-lg" />
                  <span className="text-black transition-all duration-200 text-lg">
                    Utilisateurs
                  </span>
                </div>
              </li>
            </ul>
          )}
        </ul>

        {/* Boutons en bas de la sidebar */}
        <div className="mt-auto pb-6 space-y-4">
          <button
            onClick={() => {
              window.location.href = "/pages/perfect/chat";
            }}
            className="ligth text-xl w-full px-4 py-3 rounded-lg bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            Commencer un chat
          </button>
          <button
            onClick={() => {
              window.location.href = "/pages/perfect/research";
            }}
            className="ligth w-full text-xl px-4 py-3 rounded-lg bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            Rechercher un document
          </button>
          {/* <button
            onClick={openModal}
            className="ligth text-xl w-full px-4 py-3 rounded-lg bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            Voir mon profil
          </button> */}
        </div>
      </section>

      {/* Modal de profil */}
      {/* {isModalOpen && (
        <div
          data-dialog-backdrop="dialog"
          onClick={closeModal}
          className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            data-dialog="dialog"
            className="relative m-4 p-6 w-full max-w-md rounded-lg bg-white shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Mon Profil</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 font-medium">
                  Nom d’utilisateur :
                </span>
                <span className="text-gray-800">{username}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-gray-600 font-medium">Email :</span>
                <span className="text-gray-800">{email}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default Sider;
