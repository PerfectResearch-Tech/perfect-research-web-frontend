"use client";

import React, { useEffect, useState } from "react";
import "./adminItems.css";
import { FaFile, FaCogs, FaChevronDown, FaChevronUp, FaBars, FaTimes, FaUser, FaFileUpload } from "react-icons/fa";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";

interface SiderProps {
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}

const Sider: React.FC<SiderProps> = ({ selectedItem, setSelectedItem }) => {
  const [isSystemOpen, setIsSystemOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const handleSelection = (item: string) => {
    setSelectedItem(item);
    setIsSidebarOpen(false);
  };

  const toggleSystemMenu = () => {
    setIsSystemOpen(!isSystemOpen);
  };

  useEffect(() => {
    if (localStorage.getItem("isAdmin")) {
      setIsAdmin(true);
    }
  }, []);

  const SidebarButton: React.FC<{
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
  }> = ({ icon, text, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700"
      aria-label={text}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </button>
  );

  return (
    <>
      {/* Bouton hamburger pour mobile */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-50 text-primary bg-tertiary-color p-2 rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Fermer la barre latérale" : "Ouvrir la barre latérale"}
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
            <h2 className="black text-center text-3xl py-4 text-primary">Admin</h2>
          </li>

          <li>
            <SidebarButton
              icon={<MessageSquareText size={15} />}
              text="Commencer un chat"
              onClick={() => router.push("/pages/perfect/chat")}
            />
          </li>
          <li>
            <SidebarButton
              icon={<FaFileUpload size={14} />}
              text="Rechercher un document"
              onClick={() => router.push("/pages/perfect/research")}
            />
          </li>

          {/* Menu Documents */}
          <li>
            <button
              type="button"
              className={`sider-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-black hover:bg-tertiary-color hover:text-white ${
                selectedItem === "Documents" ? "bg-tertiary-color text-white" : ""
              }`}
              onClick={() => handleSelection("Documents")}
              aria-label="Sélectionner Documents"
            >
              <FaFile className="text-black transition-all duration-200 text-lg" />
              <span className="text-black transition-all duration-200 text-lg">
                Documents
              </span>
            </button>
          </li>

          {/* Menu Système */}
          {isAdmin && (
            <ul>
              <li>
                <button
                  type="button"
                  className={`sider-item flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer text-black hover:bg-tertiary-color hover:text-white`}
                  onClick={toggleSystemMenu}
                  aria-label={isSystemOpen ? "Fermer le menu Système" : "Ouvrir le menu Système"}
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
                </button>

                {/* Sous-menus de "Système" */}
                {isSystemOpen && (
                  <ul className="space-y-2 mt-2 pl-8">
                    {["Années", "Universités", "Disciplines", "Pays"].map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-tertiary-color hover:text-primary ${
                            selectedItem === item ? "text-primary" : ""
                          }`}
                          onClick={() => handleSelection(item)}
                          aria-label={`Sélectionner ${item}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              selectedItem === item ? "bg-primary" : "bg-transparent"
                            }`}
                          />
                          <span className={`text-lg ${selectedItem === item ? "text-primary" : ""}`}>
                            {item}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li>
                <button
                  type="button"
                  className={`sider-item flex items-center gap-3 px-4 py-3 my-4 rounded-lg transition-all duration-200 cursor-pointer text-black hover:bg-tertiary-color hover:text-white ${
                    selectedItem === "Utilisateurs" ? "bg-tertiary-color text-white" : ""
                  }`}
                  onClick={() => handleSelection("Utilisateurs")}
                  aria-label="Sélectionner Utilisateurs"
                >
                  <FaUser className="text-black transition-all duration-200 text-lg" />
                  <span className="text-black transition-all duration-200 text-lg">
                    Utilisateurs
                  </span>
                </button>
              </li>
            </ul>
          )}
        </ul>

        {/* Boutons en bas de la sidebar */}
        <div className="mt-auto pb-6 space-y-4">
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
        </div>
      </section>
    </>
  );
};

export default Sider;