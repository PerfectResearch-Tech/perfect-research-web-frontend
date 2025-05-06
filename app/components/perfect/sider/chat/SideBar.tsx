// SideBar Component (Navigation latérale)
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComment, FaTimes, FaEllipsisV } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import "../sider.css";
import { getApiUrl } from "@/app/lib/config";

interface SideBarProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  activeChatId: string | null;
  chatList: any;
}

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
}

const SideBar = ({
  onSelectChat,
  onNewChat,
  activeChatId,
  chatList,
}: SideBarProps) => {
  const [savedChats, setSavedChats] = useState<Chat[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null); // État pour le menu contextuel

  // Fonction pour ouvrir/fermer la modale
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Fonction pour récupérer les chats de l'utilisateur
  const fetchUserChats = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(`${getApiUrl(`/chats/${userId}`)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des chats");
      }

      const chats = await response.json();
      setSavedChats(chats);
    } catch (error) {
      console.error("Erreur lors de la récupération des chats :", error);
      toast.error("Erreur lors de la récupération des chats");
    }
  };

  // Fonction pour supprimer un chat
  const deleteChat = async (chatId: string) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    // console.log("Chat supprimé avec succès", chatId);

    try {
      const response = await fetch(`${getApiUrl(`/chats/${chatId}`)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du chat");
      }

      // Mettre à jour l'état local après la suppression réussie
      setSavedChats((prevChats) =>
        prevChats.filter((chat) => chat.id !== chatId)
      );
      toast.success("Chat supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du chat :", error);
      toast.error("Erreur lors de la suppression du chat");
    } finally {
      // Fermer le menu contextuel après la suppression ou l'erreur
      setMenuOpenChatId(null);
    }
  };

  // Récupérer les chats au chargement du composant
  useEffect(() => {
    fetchUserChats();
  }, []);

  useEffect(() => {
    setSavedChats(chatList);
  }, [chatList]);

  // Fonction pour créer un nouveau chat
  const createNewChat = async () => {
    try {
      // Simuler une requête API pour créer un nouveau chat
      const newChat = {
        id: "",
        title: "Nouvelle conversation", // Titre par défaut
        createdAt: new Date(),
      };

      // Ajouter le nouveau chat à la liste des chats sauvegardés ET le sélectionner
      setSavedChats((prevChats) => {
        const updatedChats = [newChat, ...prevChats];
        onSelectChat(newChat.id);
        onNewChat();
        return updatedChats;
      });
      toast.success("Nouveau chat créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du chat :", error);
      toast.error("Erreur lors de la création du chat");
    }
  };

  // Grouper les chats par jour (aujourd'hui, hier, etc.)
  const groupChatsByDay = (chats: Chat[]) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

    return {
      today: chats.filter(
        (chat) => new Date(chat.createdAt).setHours(0, 0, 0, 0) === today
      ),
      yesterday: chats.filter(
        (chat) => new Date(chat.createdAt).setHours(0, 0, 0, 0) === yesterday
      ),
      older: chats.filter((chat) => {
        const chatDate = new Date(chat.createdAt).setHours(0, 0, 0, 0);
        return chatDate < yesterday;
      }),
    };
  };

  const groupedChats = groupChatsByDay(savedChats);

  // Variants pour l'animation de la barre latérale
  const sidebarVariants = {
    open: {
      width: "20rem", // 320px, équivalent à w-80
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      width: 0,
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  // Variants pour les éléments internes
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 200 },
    }),
  };

  // Fonction pour déconnecter l'utilisateur
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    router.push("/pages/authentication/login");
  };

  // Fonction pour récupérer les informations de l'utilisateur
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
      return null;
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Gestionnaire pour ouvrir/fermer le menu contextuel
  const handleMenuClick = (chatId: string) => {
    setMenuOpenChatId(menuOpenChatId === chatId ? null : chatId); // Bascule l'état
  };

  return (
    <AnimatePresence initial={false}>
      <Toaster richColors position="top-right" />
      {isSidebarOpen ? (
        <motion.section
          className="sider-bar px-5 py-10 min-h-screen bg-gray-100 border-r border-gray-200 overflow-hidden flex flex-col"
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
        >
          <div className="sider-container flex-1">
            <div className="flex items-center justify-between p-4">
              <h2 className="righteous text-xl font-semibold text-gray-800">
                Perfect Chat
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
              >
                <FaTimes size={18} />
              </motion.button>
            </div>

            <ul className="space-y-6">
              {/* Bouton Nouveau Chat */}
              <motion.li
                custom={0}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createNewChat} // Appeler createNewChat lors du clic
                  className="sider-chat-item flex flex-row gap-3 hover:bg-blue-700 px-5 py-3 bg-blue-400 text-white rounded-lg transition-all duration-200 w-full text-left items-center"
                >
                  <FaComment size={18} />
                  <p>Nouveau chat</p>
                </motion.button>
              </motion.li>

              {/* Section "Aujourd'hui" */}
              {groupedChats.today.length > 0 && (
                <motion.li
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <p className="font-semibold text-sm mb-4 text-gray-500 uppercase">
                    Aujourd'hui
                  </p>
                  <ul className="space-y-2">
                    {groupedChats.today.map((chat, index) => (
                      <motion.li
                        key={chat.id}
                        custom={index + 2}
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                      >
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectChat(chat.id)}
                            className={`sider-chat-item flex items-center gap-3 hover:bg-blue-700 px-5 py-3 bg-blue-400 text-white rounded-lg transition-all duration-200 w-full text-left ${
                              activeChatId === chat.id ? "bg-blue-600" : ""
                            }`}
                          >
                            <FaComment size={15} />
                            <span className="truncate">{chat.title}</span>
                          </motion.button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Empêche la sélection du chat
                              handleMenuClick(chat.id);
                            }}
                            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-white hover:bg-gray-200 hover:text-black rounded-full"
                          >
                            <FaEllipsisV size={16} />
                          </button>

                          {/* Menu contextuel */}
                          {menuOpenChatId === chat.id && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10">
                              <button
                                onClick={() => deleteChat(chat.id)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Supprimer le chat
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.li>
              )}

              {/* Section "Hier" */}
              {groupedChats.yesterday.length > 0 && (
                <motion.li
                  custom={groupedChats.today.length + 2}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <p className="font-semibold text-sm mb-4 text-gray-500 uppercase">
                    Hier
                  </p>
                  <ul className="space-y-2">
                    {groupedChats.yesterday.map((chat, index) => (
                      <motion.li
                        key={chat.id}
                        custom={index + groupedChats.today.length + 3}
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                      >
                        <div className="relative">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectChat(chat.id)}
                            className={`sider-chat-item flex items-center gap-3 hover:bg-blue-700 px-5 py-3 bg-blue-400 text-white rounded-lg transition-all duration-200 w-full text-left ${
                              activeChatId === chat.id ? "bg-blue-600" : ""
                            }`}
                          >
                            <FaComment size={15} />
                            <span className="truncate">{chat.title}</span>
                          </motion.button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Empêche la sélection du chat
                              handleMenuClick(chat.id);
                            }}
                            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                          >
                            <FaEllipsisV size={16} />
                          </button>

                          {/* Menu contextuel */}
                          {menuOpenChatId === chat.id && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10">
                              <button
                                onClick={() => deleteChat(chat.id)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Supprimer le chat
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.li>
              )}
            </ul>
          </div>
          <br />

          {/* Boutons en bas de la sidebar */}
          <motion.div
            className="mt-auto pb-6 space-y-4 px-4"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            custom={
              groupedChats.today.length + groupedChats.yesterday.length + 4
            }
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = "/pages/perfect/research";
              }}
              className="w-full px-4 py-3 rounded-lg bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Rechercher un document
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                window.location.href = "/pages/admin/home";
              }}
              className="w-full px-4 py-3 rounded-lg bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Ajouter un document
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                openModal();
              }}
              className="w-full px-4 py-3 rounded-lg bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Voir mon profil
            </motion.button>

            {/* Modal */}
            {isModalOpen && (
              <div
                data-dialog-backdrop="dialog"
                onClick={closeModal}
                className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
              >
                <div
                  onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant à l'intérieur
                  data-dialog="dialog"
                  className="relative m-4 p-6 w-full max-w-md rounded-lg bg-white shadow-xl"
                >
                  {/* En-tête du modal */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Mon Profil
                    </h2>
                    <button
                      onClick={() => closeModal()}
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

                  {/* Contenu du profil */}
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

                  {/* Bouton Déconnexion */}
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
            )}
          </motion.div>
        </motion.section>
      ) : (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <FaComment size={20} className="text-blue-500" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default SideBar;

// export default SideBar;

// import React from "react";
// import Image from "next/image";
// import "../sider.css";

// const SideBar = () => {
//   return (
//     <section className="sider-bar px-5 py-10 w-80 min-h-screen">
//       <div className="sider-container">
//         <ul className="space-y-6">
//           {/* Section "Perfect Chat" */}
//           <li>
//             <h2 className="righteous text-xl font-semibold text-center">
//               Perfect Chat
//             </h2>
//           </li>

//           <br />

//           {/* Section "Aujourd'hui" */}

//           <li>
//             <span className="sider-chat-item flex flex-row gap-3 hover:bg-blue-700 px-5 py-3 bg-blue-400 text-white rounded-lg transition-all duration-200">
//               <Image
//                 src={"/assets/icons/google.png"}
//                 alt="chat icon"
//                 height={24}
//                 width={24}
//               />
//               <p>Nouveau chat</p>
//             </span>
//           </li>

//           <li>
//             <p className="font-semibold text-lg mb-4">Aujourd'hui</p>
//             <ul className="space-y-2">
//               <li>
//                 <span className="sider-chat-item hover:bg-blue-700 px-5 py-3 bg-blue-400 text-white rounded-lg transition-all duration-200">
//                   Amélioration de mémoire
//                 </span>
//               </li>
//             </ul>
//           </li>

//           {/* Section "Hier" */}
//           <li>
//             <p className="font-semibold text-lg mb-4">Hier</p>
//             <ul className="space-y-2">
//               <li>
//                 <span className="sider-chat-item hover:bg-blue-700 px-5 py-3 bg-blue-400 text-white rounded-lg transition-all duration-200">
//                   Chat avec l'IA
//                 </span>
//               </li>
//               <li>
//                 <br />
//                 <span className="sider-chat-item hover:bg-blue-700 px-5 py-3 bg-blue-400 text-white rounded-lg transition-all duration-200">
//                   Discussion sur les recherches
//                 </span>
//               </li>
//             </ul>
//           </li>
//         </ul>
//       </div>
//     </section>
//   );
// };

// export default SideBar;
