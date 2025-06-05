// Importations des dépendances principales
import React, { useState, useEffect, useRef, useCallback } from "react";
// Icônes de Font Awesome
import { 
  FaComment, 
  FaPaperclip, 
  FaTimes, 
  FaPaperPlane, 
  FaMicrophone,
  FaGlobe
} from "react-icons/fa";
// Bibliothèque de notifications
import { toast } from "sonner";
// Icônes supplémentaires
import { CircleUserRound } from "lucide-react";
// Configuration de l'API
import { getApiUrl } from "@/app/lib/config";
// Génération d'ID uniques
import { v4 as uuidv4 } from "uuid";

// Interface pour définir la structure d'un message
interface Message {
  id: string | null;
  content: string;
  sender: "USER" | "ai"; // Soit envoyé par l'utilisateur, soit par l'IA
  timestamp: Date;
}

// Props attendues par le composant MainSession
interface MainSessionProps {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  initialMessages: Message[];
  fetchUserChats: () => void;
}

// Composant pour afficher un indicateur de chargement
const ChatLoading = () => (
  <div className="animate-pulse">
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block mr-1"></div>
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block mr-1"></div>
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block"></div>
  </div>
);

// Composant principal de la session de chat
const MainSession = ({
  activeChatId,
  setActiveChatId,
  initialMessages,
  fetchUserChats,
}: MainSessionProps) => {
  // États du composant
  const [messages, setMessages] = useState<Message[]>(() => initialMessages);
  const [inputValue, setInputValue] = useState(""); // Contenu du champ de saisie
  const [isAiTyping, setIsAiTyping] = useState(false); // Si l'IA est en train de répondre
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Fichier sélectionné
  const [isRecording, setIsRecording] = useState(false); // Si l'enregistrement vocal est actif
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Si le menu profil est ouvert
  const [username, setUsername] = useState(""); // Nom d'utilisateur
  const [email, setEmail] = useState(""); // Email de l'utilisateur

  // Références pour les éléments DOM
  const messagesEndRef = useRef<HTMLDivElement>(null); // Référence vers le bas des messages
  const inputRef = useRef<HTMLTextAreaElement>(null); // Référence vers le champ de saisie
  const fileInputRef = useRef<HTMLInputElement>(null); // Référence vers l'input fichier

  // Fonction pour faire défiler vers le bas des messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Effet pour scroller vers le bas quand les messages ou l'état de l'IA changent
  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping, scrollToBottom]);

  // Fonction pour récupérer les infos de l'utilisateur connecté
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

  // Effet pour charger les infos utilisateur au montage du composant
  useEffect(() => {
    fetchUser();
  }, []);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    window.location.href = "/pages/authentication/login";
  };

  // Fonction pour envoyer un message au backend
  const sendMessageToBackend = async (messageContent: string, file?: File) => {
    const userId = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!userId || !token) {
      toast.error("Vous devez être connecté pour envoyer un message.");
      return null;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let url = getApiUrl("/messages");
    let body = JSON.stringify({
      chatId: activeChatId,
      sender: "USER",
      content: messageContent,
    });
    let method = "POST";

    // Si c'est un nouveau chat (pas d'ID et pas de messages)
    if (!activeChatId && messages.length === 0) {
      url = getApiUrl("/chats");
      body = JSON.stringify({
        userId: userId,
        question: messageContent,
      });
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (!activeChatId && messages.length === 0) {
        setActiveChatId(data.id);
      }

      fetchUserChats();
      return data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      toast.error("Erreur lors de l'envoi du message");
      return null;
    }
  };

  // Fonction pour récupérer les messages d'un chat spécifique
  const fetchChatMessages = async (chatId: string) => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    try {
      const response = await fetch(`${getApiUrl(`/messages/${chatId}`)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des messages");
      }

      const messages = await response.json();
      setMessages(messages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      toast.error("Erreur lors de la récupération des messages");
    }
  };

  // Effet pour charger les messages quand le chat actif change
  useEffect(() => {
    if (activeChatId) {
      fetchChatMessages(activeChatId);
    }
  }, [activeChatId]);

  // Fonction principale pour envoyer un message
  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    // Génération d'un ID temporaire pour le message utilisateur
    const tempId = uuidv4();
    let messageContent = inputValue.trim();
    
    // Ajout du nom du fichier si un fichier est joint
    if (selectedFile) {
      messageContent += messageContent
        ? `\n\nFichier joint: ${selectedFile.name}`
        : `Fichier joint: ${selectedFile.name}`;
    }

    // Création du message utilisateur
    const userMessage: Message = {
      id: tempId,
      content: messageContent,
      sender: "USER",
      timestamp: new Date(),
    };

    // Ajout du message à la liste
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setSelectedFile(null);
    setIsAiTyping(true);

    // Envoi du message au backend
    const aiResponse = await sendMessageToBackend(messageContent, selectedFile);

    if (aiResponse) {
      // Création de la réponse de l'IA
      const aiMessage: Message = {
        id: aiResponse.id,
        content: aiResponse.content,
        sender: "ai",
        timestamp: new Date(),
      };
      
      // Mise à jour de l'ID du message utilisateur si le backend a retourné un ID
      const updatedMessages = messages.map((msg) =>
        msg.id === tempId
          ? { ...msg, id: aiResponse.userMessageIdFromBackend || msg.id }
          : msg
      );
      
      // Ajout du message de l'IA
      setMessages([...updatedMessages, aiMessage]);
    }

    setIsAiTyping(false);
  };

  // Gestion de la touche Entrée pour envoyer le message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Gestion de l'upload de fichier
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Gestion du changement de fichier sélectionné
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // Basculer entre l'état d'enregistrement vocal
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setInputValue((prev) => prev + " [Message vocal transcrit]");
    } else {
      setIsRecording(true);
    }
  };

  // Rendu du composant
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* En-tête avec le titre et le profil utilisateur */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="righteous text-xl font-semibold text-gray-800">
          Perfect Research
        </h1>
        
        {/* Menu profil utilisateur */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <CircleUserRound className="text-gray-700" size={25} />
          </button>
          
          {/* Dropdown du profil */}
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

      {/* Zone principale des messages */}
      <div className="flex-1 overflow-y-auto p-4 md:px-6">
        {messages.length === 0 ? (
          // Vue quand il n'y a pas de messages (premier chargement)
          <div className="h-full flex flex-col items-center justify-center">
            <div className="max-w-md text-center space-y-4">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <FaComment size={28} className="text-blue-500" />
                </div>
              </div>
              <h2 className="righteous text-2xl font-bold text-gray-800">
                Salut, je suis Perfect Chat
              </h2>
              <p className="text-gray-600">
                Comment puis-je vous aider aujourd'hui ? <br />
                Posez-moi une question sur votre recherche ou mémoire.
              </p>
            </div>
          </div>
        ) : (
          // Liste des messages
          <div className="space-y-6 pt-4 pb-20">
            {messages.map((message) => (
              <div
                key={message.id || uuidv4()} // Clé unique pour chaque message
                className={`flex ${
                  message.sender === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Bulle de message */}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === "USER"
                      ? "bg-blue-400 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicateur quand l'IA est en train de répondre */}
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-2xl px-4 py-3 max-w-[200px]">
                  <div className="flex items-center space-x-2">
                    <ChatLoading />
                  </div>
                </div>
              </div>
            )}
            
            {/* Référence pour le scroll automatique */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Zone de saisie des messages */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gray-100 rounded-xl border border-gray-300 shadow-sm p-2">
            {/* Input fichier caché */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* Affichage du fichier sélectionné */}
            {selectedFile && (
              <div className="px-4 pt-3 flex items-center gap-2">
                <FaPaperclip size={14} className="text-blue-500" />
                <span className="text-sm text-gray-800 truncate">
                  {selectedFile.name}
                </span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="hover:bg-gray-200 p-1 rounded-full"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            )}
            
            {/* Zone de texte principale */}
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 pl-12 pr-12 rounded-xl resize-none focus:outline-none bg-transparent border-0"
              rows={1}
              style={{ minHeight: "60px", maxHeight: "150px" }}
              placeholder="Écrivez votre message ici..."
            />

            {/* Boutons à gauche */}
            <div className="absolute left-2 bottom-2 flex gap-2">
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <FaGlobe size={16} />
              </button>
              <button
                onClick={handleFileUpload}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <FaPaperclip size={16} />
              </button>
            </div>

            {/* Boutons à droite */}
            <div className="absolute right-2 bottom-2 flex gap-2">
              <button
                onClick={toggleRecording}
                className={`p-2 rounded-full transition-colors ${
                  isRecording
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <FaMicrophone
                  size={16}
                  className={isRecording ? "animate-pulse" : ""}
                />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() && !selectedFile}
                className={`p-2 rounded-full ${
                  inputValue.trim() || selectedFile
                    ? "bg-blue-400 text-white hover:bg-blue-500"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSession;