import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaComment, FaTimes, FaEllipsisV } from "react-icons/fa"; // FaSearch et FaFileUpload supprimés
// import { useRouter } from "next/navigation"; // supprimé car non utilisé
import { toast, Toaster } from "sonner";
import { getApiUrl } from "@/app/lib/config";
import { Search, SquarePen } from "lucide-react";
import { RxHamburgerMenu } from "react-icons/rx";

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
}

interface SideBarProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  activeChatId: string | null;
  chatList: Chat[];
}

const SideBar: React.FC<SideBarProps> = ({
  onSelectChat,
  onNewChat,
  activeChatId,
  chatList,
}) => {
  const [savedChats, setSavedChats] = useState<Chat[]>(chatList);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);
  // const router = useRouter(); // supprimé

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setSavedChats(chatList);
  }, [chatList]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "Nouvelle conversation",
      createdAt: new Date(),
    };
    setSavedChats((prev) => [newChat, ...prev]);
    onSelectChat(newChat.id);
    onNewChat();
    toast.success("Nouveau chat créé");
  };

  const deleteChat = async (chatId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Non authentifié");
      await fetch(`${getApiUrl(`/chats/${chatId}`)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedChats((prev) => prev.filter((chat) => chat.id !== chatId));
      toast.success("Chat supprimé");
    } catch {
      toast.error("Échec de la suppression");
    } finally {
      setMenuOpenChatId(null);
    }
  };

  const filteredChats = savedChats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChatsByDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      today: filteredChats.filter((chat) => new Date(chat.createdAt) >= today),
      yesterday: filteredChats.filter((chat) => {
        const date = new Date(chat.createdAt);
        return date >= yesterday && date < today;
      }),
      older: filteredChats.filter((chat) => new Date(chat.createdAt) < yesterday),
    };
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: isMobile ? "-100%" : 0, opacity: isMobile ? 0 : 1 },
  };

  const overlayVariants = {
    open: { opacity: 1, pointerEvents: "auto" as const},
    closed: { opacity: 0, pointerEvents: "none" as const},
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            key="overlay"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            key="sidebar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ type: "spring", damping: 25 }}
            className="fixed md:relative z-50 h-screen w-72 bg-white shadow-xl flex flex-col border-r border-gray-200"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Perfect Chat</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 md:hidden"
                aria-label="Fermer la barre latérale"
                type="button"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des chats..."
                  className="w-full pl-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                  aria-label="Rechercher des chats"
                />
              </div>

              <button
                onClick={createNewChat}
                className="flex items-center mt-4 gap-3 w-full p-3 text-black rounded-lg transition-all"
                type="button"
              >
                <SquarePen size={16} />
                <span className="regular">Nouveau chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {Object.entries(groupChatsByDate()).map(
                ([date, chats]) =>
                  chats.length > 0 && (
                    <div key={date} className="mb-6">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">
                        {date === "today"
                          ? "Aujourd'hui"
                          : date === "yesterday"
                          ? "Hier"
                          : "Plus ancien"}
                      </h3>
                      <ul className="space-y-1">
                        {chats.map((chat) => (
                          <li key={chat.id} className="relative">
                            <button
                              onClick={() => onSelectChat(chat.id)}
                              className={`flex items-center w-full p-3 rounded-lg ${
                                activeChatId === chat.id
                                  ? "bg-blue-50 text-blue-600"
                                  : "hover:bg-gray-100"
                              }`}
                              type="button"
                            >
                              <FaComment className="mr-3 flex-shrink-0" size={14} />
                              <span className="truncate">{chat.title}</span>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenChatId(
                                  menuOpenChatId === chat.id ? null : chat.id
                                );
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200"
                              aria-label={`Options pour la conversation ${chat.title}`}
                              type="button"
                            >
                              <FaEllipsisV size={14} />
                            </button>

                            {menuOpenChatId === chat.id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                <button
                                  onClick={() => deleteChat(chat.id)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                                  type="button"
                                >
                                  Supprimer
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-full shadow-lg"
          aria-label="Ouvrir la barre latérale"
          type="button"
        >
          <RxHamburgerMenu size={20} />
        </button>
      )}
    </>
  );
};

export default SideBar;
