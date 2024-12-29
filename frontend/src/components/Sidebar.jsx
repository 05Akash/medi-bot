// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BiLogOut, BiSearch } from 'react-icons/bi';
// import { HiMenuAlt3 } from 'react-icons/hi';
// import { RiMentalHealthFill } from 'react-icons/ri';
// import { useChat } from '../context/ChatContext';
// import { useUser } from '../context/UserContext';
// import ApiService from '../services/api';
// import React, { useEffect, useState } from 'react';

// const Sidebar = ({ open, setOpen }) => {
//   const [recentChats, setRecentChats] = useState([]);
  
//   useEffect(() => {
//     const fetchRecentChats = async () => {
//       try {
//         const response = await ApiService.getChatHistory();
//         if (response.chats) {
//           // Flatten all messages from all chats and sort by date
//           const allMessages = response.chats.flatMap(chat => 
//             chat.messages.map(msg => ({
//               ...msg,
//               chatId: chat.chat_id
//             }))
//           );
          
//           // Sort by date and take the 10 most recent
//           const sortedMessages = allMessages
//             .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//             .slice(0, 10);
            
//           setRecentChats(sortedMessages);
//         }
//       } catch (error) {
//         console.error('Failed to fetch recent chats:', error);
//       }
//     };

//     if (open) {
//       fetchRecentChats();
//     }
//   }, [open]);

//   const { chatHistory } = useChat();
//   const { setUser } = useUser();
//   const navigate = useNavigate();

//   const handleSearchClick = () => {
//     if (!open) {
//       setOpen(true);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await ApiService.logout();
//       setUser(null);
//       navigate('/');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <div
//       className={`fixed left-0 top-0 h-screen bg-[#0e0e0e] ${
//         open ? "w-72" : "w-16"
//       } duration-500 text-gray-100 px-4 z-20 flex flex-col`}
//     >
//       <div>
//         <div className="py-3 flex justify-between items-center">
//           {open ? (
//             <Link to="/" className="flex items-center gap-3">
//               <RiMentalHealthFill 
//                 size={26} 
//                 className="text-[#2AF598] transition-all duration-300 hover:text-[#009EFD]"
//               />
//               <h1 className="font-bold text-lg">
//                 Medical Bot
//               </h1>
//             </Link>
//           ) : (
//             <div className="w-full flex justify-end">
//               <HiMenuAlt3
//                 size={26}
//                 className="cursor-pointer"
//                 onClick={() => setOpen(true)}
//               />
//             </div>
//           )}
//           {open && (
//             <HiMenuAlt3
//               size={26}
//               className="cursor-pointer"
//               onClick={() => setOpen(false)}
//             />
//           )}
//         </div>

//         <div className="mt-4 relative">
//           <div className={`flex items-center ${!open && "justify-center"}`}>
//             {!open ? (
//               <button
//                 onClick={handleSearchClick}
//                 className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2AF598] to-[#009EFD] flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none"
//               >
//                 <BiSearch size={20} />
//               </button>
//             ) : (
//               <div className="w-full relative">
//                 <input
//                   type="text"
//                   placeholder="Search something"
//                   className="w-full bg-[#2f3640] rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none"
//                 />
//                 <button className="absolute right-0 top-0 h-full aspect-square rounded-full bg-gradient-to-r from-[#2AF598] to-[#009EFD] flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none">
//                   <BiSearch size={20} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {open && chatHistory.length > 0 && (
//           <div className="mt-8 space-y-2">
//             {chatHistory.map((chat, index) => (
//               <div key={index} className="text-gray-300 text-sm py-2 px-2 hover:bg-gray-800 rounded-md transition-colors duration-200">
//                 {chat.content.substring(0, 50)}...
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="mt-auto pb-4">
//         <button
//           onClick={handleLogout}
//           className="group flex items-center text-sm gap-3.5 font-medium p-2 w-full hover:bg-gray-800 rounded-md"
//         >
//           <div>
//             <BiLogOut size={20} />
//           </div>
//           <h2
//             className={`whitespace-pre duration-500 ${
//               !open && "opacity-0 translate-x-28 overflow-hidden"
//             }`}
//           >
//             Logout
//           </h2>
//           <h2
//             className={`${
//               open && "hidden"
//             } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
//           >
//             Logout
//           </h2>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiLogOut, BiSearch } from 'react-icons/bi';
import { HiMenuAlt3 } from 'react-icons/hi';
import { RiMentalHealthFill } from 'react-icons/ri';
import { useChat } from '../context/ChatContext';
import { useUser } from '../context/UserContext';
import ApiService from '../services/api';

const Sidebar = ({ open, setOpen }) => {
  const [recentChats, setRecentChats] = useState([]);
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const response = await ApiService.getChatHistory();
        if (response.chats) {
          // Flatten all messages from all chats and sort by date
          const allMessages = response.chats.flatMap(chat => 
            chat.messages.map(msg => ({
              ...msg,
              chatId: chat.chat_id
            }))
          );
          
          // Sort by date and take the 10 most recent
          const sortedMessages = allMessages
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10);
            
          setRecentChats(sortedMessages);
        }
      } catch (error) {
        console.error('Failed to fetch recent chats:', error);
      }
    };

    if (open) {
      fetchRecentChats();
    }
  }, [open]);

  const handleSearchClick = () => {
    if (!open) {
      setOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await ApiService.logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-[#0e0e0e] ${
        open ? "w-72" : "w-16"
      } duration-500 text-gray-100 px-4 z-20 flex flex-col`}
    >
      <div>
        <div className="py-3 flex justify-between items-center">
          {open ? (
            <Link to="/" className="flex items-center gap-3">
              <RiMentalHealthFill 
                size={26} 
                className="text-[#2AF598] transition-all duration-300 hover:text-[#009EFD]"
              />
              <h1 className="font-bold text-lg">
                Medical Bot
              </h1>
            </Link>
          ) : (
            <div className="w-full flex justify-end">
              <HiMenuAlt3
                size={26}
                className="cursor-pointer"
                onClick={() => setOpen(true)}
              />
            </div>
          )}
          {open && (
            <HiMenuAlt3
              size={26}
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            />
          )}
        </div>

        <div className="mt-4 relative">
          <div className={`flex items-center ${!open && "justify-center"}`}>
            {!open ? (
              <button
                onClick={handleSearchClick}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2AF598] to-[#009EFD] flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none"
              >
                <BiSearch size={20} />
              </button>
            ) : (
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search something"
                  className="w-full bg-[#2f3640] rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none"
                />
                <button className="absolute right-0 top-0 h-full aspect-square rounded-full bg-gradient-to-r from-[#2AF598] to-[#009EFD] flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-none">
                  <BiSearch size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages Section */}
        {open && recentChats.length > 0 && (
          <div className="mt-8 space-y-2">
            <h3 className="text-gray-400 text-sm font-medium px-2">Recent Messages</h3>
            {recentChats.map((message) => (
              <div
                key={message.id}
                className={`text-gray-300 text-sm py-2 px-2 hover:bg-gray-800 rounded-md transition-colors duration-200 cursor-pointer ${
                  message.is_bot ? 'border-l-2 border-[#2AF598]' : ''
                }`}
                onClick={() => navigate(`/chat/${message.chatId}`)}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${message.is_bot ? 'text-[#2AF598]' : 'text-[#009EFD]'}`}>
                    {message.is_bot ? 'Bot' : 'You'}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="truncate">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pb-4">
        <button
          onClick={handleLogout}
          className="group flex items-center text-sm gap-3.5 font-medium p-2 w-full hover:bg-gray-800 rounded-md"
        >
          <div>
            <BiLogOut size={20} />
          </div>
          <h2
            className={`whitespace-pre duration-500 ${
              !open && "opacity-0 translate-x-28 overflow-hidden"
            }`}
          >
            Logout
          </h2>
          <h2
            className={`${
              open && "hidden"
            } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
          >
            Logout
          </h2>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;