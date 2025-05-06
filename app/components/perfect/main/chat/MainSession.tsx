// Type pour les messages
interface Message {
  id: string | null;
  content: string;
  sender: "USER" | "ai";
  timestamp: Date;
}

interface MainSessionProps {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  initialMessages: Message[];
  fetchUserChats: () => void;
}

// Type Chat pour SideBar
interface Chat {
  id: string;
  title: string;
  createdAt: Date;
}

interface SideBarProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  activeChatId: string | null;
}

// =====================================================================================
// COMPONENTS
// =====================================================================================

// ChatLoading Component (Placeholder pour le chargement)
const ChatLoading = () => (
  <div className="animate-pulse">
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block mr-1"></div>
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block mr-1"></div>
    <div className="w-3 h-3 bg-gray-400 rounded-full inline-block"></div>
  </div>
);

import { getApiUrl } from "@/app/lib/config";
// MainSession Component (Gestion de la session de chat)
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaComment,
  FaGlobe,
  FaPaperclip,
  FaTimes,
  FaPaperPlane,
  FaMicrophone,
} from "react-icons/fa";
import { toast } from "sonner";

const MainSession = ({
  activeChatId,
  setActiveChatId,
  initialMessages,
  fetchUserChats,
}: MainSessionProps) => {
  const [messages, setMessages] = useState<Message[]>(() => initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages (using useCallback for memoization)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping, scrollToBottom]);

  // Envoyer un message au backend
  const sendMessageToBackend = async (messageContent: string, file?: File) => {
    const userId = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");

    if (!userId || !token) {
      toast.error("Vous devez être connecté pour envoyer un message.");
      return null; // Important de retourner null en cas d'erreur
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

    // Créer un nouveau chat s'il n'y a pas de activeChatId ou s'il est à "null"
    if (!activeChatId && messages.length === 0) {
      url = getApiUrl("/chats");
      body = JSON.stringify({
        userId: userId,
        question: messageContent,
      });

      console.log("No message");
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
    } finally {
      console.log(activeChatId, messages, userId);

      // setIsAiTyping(false);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("user");

    if (!token || !userId) {
      console.error("Vous devez être connecté pour effectuer cette action.");
      return;
    }

    console.log(chatId);

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

      console.log(messages);

      setMessages(messages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      toast.error("Erreur lors de la récupération des messages");
    }
  };

  // Récupérer les chats au chargement du composant
  useEffect(() => {
    if (activeChatId) {
      fetchChatMessages(activeChatId);
    }
  }, [activeChatId]);

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    let messageContent = inputValue.trim();
    if (selectedFile) {
      messageContent += messageContent
        ? `\n\nFichier joint: ${selectedFile.name}`
        : `Fichier joint: ${selectedFile.name}`;
    }

    const userMessage: Message = {
      id: null,
      content: messageContent,
      sender: "USER",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setSelectedFile(null);
    setIsAiTyping(true);

    // Envoyer le message au backend
    const aiResponse = await sendMessageToBackend(messageContent, selectedFile);

    if (aiResponse) {
      const aiMessage: Message = {
        id: aiResponse.id,
        content: aiResponse.content,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }

    setIsAiTyping(false);
  };

  // Gestion de la touche Enter
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // Gestion du microphone
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setInputValue((prev) => prev + " [Message vocal transcrit]");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-center">
        <h1 className="righteous text-xl font-semibold text-gray-800">
          Perfect Research
        </h1>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 md:px-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="max-w-md text-center space-y-4">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <FaComment size={28} className="text-blue-500" />
                </div>
              </div>
              <h2 className="righteous text-2xl font-bold text-gray-800">
                Salut, je suis Perfect Research
              </h2>
              <p className="text-gray-600">
                Comment puis-je vous aider aujourd’hui ? <br />
                Posez-moi une question sur votre recherche ou mémoire.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pt-4 pb-20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "USER" ? "justify-end" : "justify-start"
                }`}
              >
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
            {isAiTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-2xl px-4 py-3 max-w-[200px]">
                  <div className="flex items-center space-x-2">
                    <ChatLoading />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gray-100 rounded-xl border border-gray-300 shadow-sm p-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
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

// import Image from "next/image";
// import React from "react";
// import "../main.css";

// const MainSession = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4">
//       <div className="w-full max-w-2xl p-6">
//         <br />
//         <h1 className="righteous text-2xl font-bold text-center text-gray-800">
//           Salut, je suis perfect research
//         </h1>
//         <br />
//         <p className="text-center text-gray-600 mt-2">
//           Comment pourrai-je vous aider aujourd’hui ? <br /> Ou plutôt parlons
//           de votre mémoire
//         </p>

//         <br />

//         <div className="mt-6 relative">
//           <textarea
//             className="chat-erea w-full p-4 pl-8 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows={4}
//             placeholder="Écrivez votre message ici..."
//           ></textarea>

//           {/* Bouton Fichier (à gauche) */}

//           <span className="absolute left-2 bottom-2 flex gap-3">
//             <button className="chat-form-btn py-1 px-2 rounded-full hover:bg-gray-300 focus:outline-none flex items-center gap-2">
//               <Image
//                 src="/assets/icons/world.png"
//                 alt="microphone"
//                 width={18}
//                 height={18}
//               />{" "}
//               <p>Recherche</p>
//             </button>
//             <button className="chat-form-btn p-1 rounded-full hover:bg-gray-300 focus:outline-none">
//               <Image
//                 src="/assets/icons/attach_file.png"
//                 alt="microphone"
//                 width={18}
//                 height={18}
//               />
//             </button>
//           </span>

//           {/* Bouton Microphone (à droite) */}
//           <button className="chat-form-btn absolute right-2 bottom-2 p-1 rounded-full hover:bg-gray-300 focus:outline-none">
//             <Image
//               src="/assets/icons/mic.png"
//               alt="microphone"
//               width={18}
//               height={18}
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainSession;
