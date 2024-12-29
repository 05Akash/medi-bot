// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import ApiService from '../services/api';
// import { useChat } from '../context/ChatContext';
// import { useUser } from '../context/UserContext';
// import { AiOutlineUser } from "react-icons/ai";
// import { BiSend, BiPaperclip, BiCopy, BiCheck } from "react-icons/bi";
// import { BsSun, BsMoon } from "react-icons/bs";

// const Home = () => {
//   // Context and navigation hooks
//   const { chatHistory, setChatHistory, currentChat, setCurrentChat } = useChat();
//   const { user } = useUser();
//   const navigate = useNavigate();
//   const messagesEndRef = useRef(null);

//   // Local state
//   const [sidebarOpen, setSidebarOpen] = useState(() => {
//     const savedState = localStorage.getItem('sidebarOpen');
//     return savedState !== null ? JSON.parse(savedState) : false;
//   });
//   const [darkMode, setDarkMode] = useState(true);
//   const [message, setMessage] = useState("");
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [chatHistory]);

//   // Check authentication and load chat history
//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     const loadChatHistory = async () => {
//       try {
//         const response = await ApiService.getChatHistory();
//         if (response.chats && response.chats.length > 0) {
//           setChatHistory(response.chats);
//           setCurrentChat(response.chats[0].chat_id);
//         } else {
//           // Create new chat if no history exists
//           const newChat = await ApiService.createNewChat();
//           if (newChat.welcome_message) {
//             setChatHistory([newChat.welcome_message]);
//           }
//           setCurrentChat(newChat.chat_id);
//         }
//       } catch (err) {
//         console.error('Failed to load chat history:', err);
//       }
//     };

//     loadChatHistory();
//   }, [user, navigate, setChatHistory, setCurrentChat]);

//   // Effect for new chat creation
//   useEffect(() => {
//     if (currentChat && chatHistory.length === 0) {
//       const createNewChat = async () => {
//         try {
//           const newChat = await ApiService.createNewChat();
//           if (newChat.welcome_message) {
//             setChatHistory([newChat.welcome_message]);
//           }
//         } catch (err) {
//           console.error('Failed to create new chat:', err);
//         }
//       };
//       createNewChat();
//     }
//   }, [currentChat, chatHistory.length, setChatHistory]);

//   // Persist sidebar state
//   useEffect(() => {
//     localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
//   }, [sidebarOpen]);

//   // Reset copied state
//   useEffect(() => {
//     if (copiedIndex !== null) {
//       const timer = setTimeout(() => {
//         setCopiedIndex(null);
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [copiedIndex]);

//   const handleCopy = (text, index) => {
//     navigator.clipboard.writeText(text);
//     setCopiedIndex(index);
//   };

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!message.trim() || loading) return;

//     try {
//       setLoading(true);
      
//       // Create new chat if none exists
//       let chatId = currentChat;
//       if (!chatId) {
//         const newChat = await ApiService.createNewChat();
//         chatId = newChat.chat_id;
//         setCurrentChat(chatId);
        
//         // Add welcome message to chat history
//         if (newChat.welcome_message) {
//           setChatHistory([newChat.welcome_message]);
//         }
//       }

//       // Optimistically update UI
//       const userMessage = {
//         id: Date.now(),
//         content: message,
//         is_bot: false,
//         created_at: new Date().toISOString()
//       };

//       setChatHistory(prev => [...prev, userMessage]);
//       const currentMessage = message;
//       setMessage("");

//       // Send message to API
//       const response = await ApiService.sendMessage(chatId, currentMessage);
      
//       // Add bot response
//       setChatHistory(prev => [...prev, {
//         id: Date.now() + 1,
//         content: response.bot_response,
//         is_bot: true,
//         created_at: new Date().toISOString()
//       }]);
//     } catch (err) {
//       console.error('Failed to send message:', err);
//       // You might want to show an error toast here
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAttachment = () => {
//     // Implement attachment handling
//     console.log("Attachment feature coming soon");
//   };

//   return (
//     <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
//       <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

//       <div className={`flex-1 transition-all duration-500 ${sidebarOpen ? "ml-72" : "ml-16"}`}>
//         {/* Navbar */}
//         <header
//           className={`fixed top-0 right-0 z-10 flex justify-between items-center px-6 py-4 h-16 ${
//             darkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-800"
//           } transition-colors duration-300`}
//           style={{
//             width: `calc(100% - ${sidebarOpen ? "18rem" : "4rem"})`,
//           }}
//         >
//           <div className="flex items-center space-x-4">
//             <h1 className={`text-xl font-bold transition-opacity duration-300 ${
//               sidebarOpen ? "opacity-0 invisible" : "opacity-100 visible"
//             }`}>
//               Medical Bot
//             </h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="p-2 rounded-full hover:bg-gray-700/20 transition-colors"
//             >
//               {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
//             </button>
//             <div className="text-2xl cursor-pointer" onClick={() => navigate("/user")}>
//               <AiOutlineUser />
//             </div>
//           </div>
//         </header>

//         {/* Main Container */}
//         <div className="flex flex-col h-screen pt-16">
//           <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
//             {/* Chat Messages */}
//             <div className="w-full max-w-3xl flex-1 overflow-y-auto mb-6 rounded-lg">
//               <div className="space-y-4 p-4">
//                 {chatHistory.map((msg, index) => (
//                   <div
//                     key={msg.id}
//                     className={`flex ${msg.is_bot ? "justify-start" : "justify-end"}`}
//                   >
//                     <div className="group relative">
//                       <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
//                         !msg.is_bot
//                           ? "bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white"
//                           : darkMode
//                           ? "bg-gray-800 text-white"
//                           : "bg-white text-gray-800 shadow-md"
//                       }`}>
//                         {msg.content}
//                       </div>
//                       <button
//                         onClick={() => handleCopy(msg.content, index)}
//                         className={`absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full 
//                           ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} 
//                           opacity-0 group-hover:opacity-100 transition-all duration-200`}
//                       >
//                         {copiedIndex === index ? (
//                           <BiCheck size={16} className="text-green-500" />
//                         ) : (
//                           <BiCopy size={16} className={darkMode ? "text-gray-300" : "text-gray-600"} />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Message Input */}
//             <div className="w-full max-w-3xl mb-8">
//               <form onSubmit={handleSend} className="relative">
//                 <input
//                   type="text"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Ask Med Bot ..."
//                   className={`w-full rounded-full py-2.5 pl-6 pr-24 focus:outline-none ${
//                     darkMode 
//                       ? "bg-gray-800 text-white placeholder-gray-400"
//                       : "bg-white text-gray-800 placeholder-gray-500 shadow-md"
//                   }`}
//                 />
//                 <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
//                   <button
//                     type="button"
//                     onClick={handleAttachment}
//                     className="p-2 rounded-full hover:bg-gray-700/20 transition-colors text-gray-400 hover:text-gray-600"
//                   >
//                     <BiPaperclip size={20} />
//                   </button>
//                   <button
//                     type="submit"
//                     className="p-2 rounded-full bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white hover:shadow-lg transition-all duration-300"
//                   >
//                     <BiSend size={20} />
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ApiService from '../services/api';
import { useChat } from '../context/ChatContext';
import { useUser } from '../context/UserContext';
import { AiOutlineUser } from "react-icons/ai";
import { BiSend, BiPaperclip, BiCopy, BiCheck } from "react-icons/bi";
import { BsSun, BsMoon } from "react-icons/bs";

const Home = () => {
  const { chatHistory, setChatHistory, currentChat, setCurrentChat } = useChat();
  const { user } = useUser();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState !== null ? JSON.parse(savedState) : false;
  });
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Welcome message state
  const [showWelcome, setShowWelcome] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadChatHistory = async () => {
      try {
        const response = await ApiService.getChatHistory();
        if (response.chats && response.chats.length > 0) {
          setChatHistory(response.chats);
          setCurrentChat(response.chats[0].chat_id);
          setShowWelcome(false);
        } else {
          const newChat = await ApiService.createNewChat();
          if (newChat.welcome_message) {
            setChatHistory([{
              id: Date.now(),
              content: "👋 Hi there! I'm your medical assistant. What can I help you with today?",
              is_bot: true,
              created_at: new Date().toISOString()
            }]);
          }
          setCurrentChat(newChat.chat_id);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadChatHistory();
  }, [user, navigate, setChatHistory, setCurrentChat]);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    if (copiedIndex !== null) {
      const timer = setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    try {
      setLoading(true);
      setShowWelcome(false);
      
      let chatId = currentChat;
      if (!chatId) {
        const newChat = await ApiService.createNewChat();
        chatId = newChat.chat_id;
        setCurrentChat(chatId);
      }

      const userMessage = {
        id: Date.now(),
        content: message,
        is_bot: false,
        created_at: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, userMessage]);
      const currentMessage = message;
      setMessage("");

      const response = await ApiService.sendMessage(chatId, currentMessage);
      
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        content: response.bot_response,
        is_bot: true,
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-500 ${sidebarOpen ? "ml-72" : "ml-16"}`}>
        <header
          className={`fixed top-0 right-0 z-10 flex justify-between items-center px-6 py-4 h-16 ${
            darkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-800"
          } transition-colors duration-300`}
          style={{ width: `calc(100% - ${sidebarOpen ? "18rem" : "4rem"})` }}
        >
          <div className="flex items-center space-x-4">
            <h1 className={`text-xl font-bold transition-opacity duration-300 ${
              sidebarOpen ? "opacity-0 invisible" : "opacity-100 visible"
            }`}>
              Medical Bot
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-700/20 transition-colors"
            >
              {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
            </button>
            <div className="text-2xl cursor-pointer" onClick={() => navigate("/user")}>
              <AiOutlineUser />
            </div>
          </div>
        </header>

        <div className="flex flex-col h-screen pt-16">
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
            <div className="w-full max-w-3xl flex-1 overflow-y-auto mb-6 rounded-lg">
              <div className="space-y-4 p-4">
                {showWelcome && chatHistory.length === 0 && (
                  <div className="flex justify-start">
                    <div className="group relative">
                      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800 shadow-md"
                      }`}>
                        👋 Hi there! I'm your medical assistant. What can I help you with today?
                      </div>
                    </div>
                  </div>
                )}
                
                {chatHistory.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.is_bot ? "justify-start" : "justify-end"}`}
                  >
                    <div className="group relative">
                      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        !msg.is_bot
                          ? "bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white"
                          : darkMode
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800 shadow-md"
                      }`}>
                        {msg.content}
                      </div>
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className={`absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full 
                          ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} 
                          opacity-0 group-hover:opacity-100 transition-all duration-200`}
                        title="Copy message"
                      >
                        {copiedIndex === index ? (
                          <BiCheck size={16} className="text-green-500" />
                        ) : (
                          <BiCopy size={16} className={darkMode ? "text-gray-300" : "text-gray-600"} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="w-full max-w-3xl mb-8">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask your medical question..."
                  className={`w-full rounded-full py-2.5 pl-6 pr-24 focus:outline-none ${
                    darkMode 
                      ? "bg-gray-800 text-white placeholder-gray-400"
                      : "bg-white text-gray-800 placeholder-gray-500 shadow-md"
                  }`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`p-2 rounded-full bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white 
                      hover:shadow-lg transition-all duration-300 ${loading ? 'opacity-50' : ''}`}
                  >
                    <BiSend size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;