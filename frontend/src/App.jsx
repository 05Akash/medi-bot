// import React, { useEffect } from "react";
// import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
// import Home from "./components/Home"; 
// import { Login } from "./components/Login";
// import { Signup } from "./components/Signup";
// import Hero from "./components/Hero";
// import { UserProvider } from './context/UserContext.jsx';
// import { ChatProvider } from './context/ChatContext.jsx';
// import { useUser } from './context/UserContext.jsx';
// import Form from "./components/Form"; 

// const PrivateRoute = ({ children }) => {
//   const { user } = useUser();
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   return user ? children : null;
// };

// const App = () => {
//   return (
//     <UserProvider>
//       <ChatProvider>
//         <Routes>
//           <Route path="/" element={<Hero />} />
//           <Route 
//             path="/home" 
//             element={
//               <PrivateRoute>
//                 <Home />
//               </PrivateRoute>
//             } 
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route 
//            path="/form" 
//            element={  <Form />   } 
//           />
//         </Routes>
//       </ChatProvider>
//     </UserProvider>
//   );
// };

// export default App

import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";  // Changed from { Login }
import Signup from "./components/Signup";  // Changed from { Signup }
import Hero from "./components/Hero";
import { UserProvider } from './context/UserContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import { useUser } from './context/UserContext.jsx';
import Form from "./components/Form";

const PrivateRoute = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  return user ? children : null;
};

const App = () => {
  return (
    <UserProvider>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/form" 
            element={<Form />}
          />
        </Routes>
      </ChatProvider>
    </UserProvider>
  );
};

export default App;