import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComment, FaTimes, FaEllipsisV, FaSearch, FaFileUpload, FaUser, FaSignOutAlt } from "react-icons/fa";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ... (conserver les autres fonctions existantes comme fetchUserChats, deleteChat, etc.)

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      x: isMobile ? '-100%' : 0,
      opacity: isMobile ? 0 : 1,
      width: isMobile ? 0 : '20rem',
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const overlayVariants = {
    open: { opacity: 1, pointerEvents: 'auto' },
    closed: { opacity: 0, pointerEvents: 'none' }
  };

  return (
    <>
      <Toaster key="toaster" richColors position="top-right" />
      
      {/* Overlay pour mobile */}
      {isMobile && (
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="overlay"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      )}

      <AnimatePresence initial={false}>
        {/* Sidebar principale */}
        {isSidebarOpen ? (
          <motion.aside
            key="sidebar"
            className="fixed md:relative z-50 h-full w-80 bg-white shadow-lg md:shadow-none flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Perfect Chat</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600 md:hidden"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <div className="p-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createNewChat}
                  className="flex items-center justify-center gap-2 w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
                >
                  <FaComment size={16} />
                  <span>Nouveau chat</span>
                </motion.button>
              </div>

              <div className="px-4 pb-4 overflow-y-auto max-h-[60vh]">
                {/* Liste des chats (conserver la logique existante) */}
                {groupedChats.today.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Aujourd'hui</h3>
                    <ul className="space-y-1">
                      {groupedChats.today.map((chat) => (
                        <motion.li
                          key={`today-${chat.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="relative">
                            <button
                              onClick={() => onSelectChat(chat.id)}
                              className={`flex items-center w-full p-3 rounded-lg text-left ${
                                activeChatId === chat.id 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <FaComment className="mr-2 flex-shrink-0" size={14} />
                              <span className="truncate">{chat.title}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(chat.id);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
                            >
                              <FaEllipsisV size={14} />
                            </button>

                            {menuOpenChatId === chat.id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                <button
                                  onClick={() => deleteChat(chat.id)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Répéter pour hier et plus ancien */}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/pages/perfect/research")}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <FaSearch className="mr-2" size={14} />
                  <span>Rechercher un document</span>
                </button>

                <button
                  onClick={() => router.push("/pages/admin/home")}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <FaFileUpload className="mr-2" size={14} />
                  <span>Ajouter un document</span>
                </button>

                <button
                  onClick={openModal}
                  className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  <FaUser className="mr-2" size={14} />
                  <span>Mon profil</span>
                </button>
              </div>
            </div>
          </motion.aside>
        ) : (
          <motion.button
            key="sidebar-toggle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed bottom-4 left-4 z-30 p-3 bg-blue-500 text-white rounded-full shadow-lg md:hidden"
          >
            <FaComment size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal Profil (conserver la version existante) */}

      {isModalOpen && (
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

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 font-medium">
                        Nom d'utilisateur :
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
            )}
    </>
  );
};

export default SideBar;






















            