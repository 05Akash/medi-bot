// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FcGoogle } from 'react-icons/fc';
// import { BsFacebook, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
// import { BiErrorCircle } from 'react-icons/bi';
// import { RiMentalHealthFill } from 'react-icons/ri';
// import ApiService from '../services/api';
// import { useUser } from '../context/UserContext';

// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

// export const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();
//   const { setUser } = useUser();

//   useEffect(() => {
//     // Initialize Google Sign-In
//     const loadGoogleScript = () => {
//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
      
//       script.onload = () => {
//         window.google.accounts.id.initialize({
//           client_id: GOOGLE_CLIENT_ID,
//           callback: handleGoogleLogin
//         });
//       };
//     };

//     // Initialize Facebook SDK
//     const loadFacebookScript = () => {
//       window.fbAsyncInit = function() {
//         window.FB.init({
//           appId: FACEBOOK_APP_ID,
//           cookie: true,
//           xfbml: true,
//           version: 'v18.0'
//         });
//       };

//       (function(d, s, id) {
//         var js, fjs = d.getElementsByTagName(s)[0];
//         if (d.getElementById(id)) return;
//         js = d.createElement(s); js.id = id;
//         js.src = "https://connect.facebook.net/en_US/sdk.js";
//         fjs.parentNode.insertBefore(js, fjs);
//       }(document, 'script', 'facebook-jssdk'));
//     };

//     loadGoogleScript();
//     loadFacebookScript();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     try {
//       const response = await ApiService.login(email, password, rememberMe);
//       if (response.token) {
//         setUser(response.user);
//         navigate('/home');
//       }
//     } catch (err) {
//       setError(err.error || 'Invalid email or password');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleGoogleLogin = async (response) => {
//     try {
//       const result = await ApiService.socialLogin('google', response.credential);
//       setUser(result.user);
//       navigate('/home');
//     } catch (error) {
//       setError('Google login failed. Please try again.');
//     }
//   };

//   const handleFacebookLogin = () => {
//     window.FB.login(async function(response) {
//       if (response.authResponse) {
//         try {
//           const result = await ApiService.socialLogin('facebook', response.authResponse.accessToken);
//           setUser(result.user);
//           navigate('/home');
//         } catch (error) {
//           setError('Facebook login failed. Please try again.');
//         }
//       }
//     }, {scope: 'public_profile,email'});
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
//       <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#2AF598]/10 to-[#009EFD]/10 pointer-events-none" />
        
//         <div className="relative">
//           <div className="text-center mb-8">
//             <div className="flex justify-center mb-4">
//               <RiMentalHealthFill size={48} className="text-[#2AF598]" />
//             </div>
//             <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
//             <p className="text-gray-400">Sign in to continue to Medical Bot</p>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center space-x-2 animate-shake">
//               <BiErrorCircle className="text-red-500 text-xl flex-shrink-0" />
//               <p className="text-red-500 text-sm">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 required
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#2AF598] focus:outline-none transition-colors duration-300"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   required
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#2AF598] focus:outline-none transition-colors duration-300 pr-12"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
//                 >
//                   {showPassword ? <BsEyeSlashFill size={20} /> : <BsEyeFill size={20} />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-[#2AF598] focus:ring-[#2AF598] focus:ring-offset-gray-800"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
//                   Remember me
//                 </label>
//               </div>
//               <Link to="/forgot-password" className="text-sm text-[#2AF598] hover:text-[#009EFD] transition-colors">
//                 Forgot password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-lg bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white font-semibold hover:shadow-lg transition-all duration-300 ${
//                 loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
//               }`}
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </button>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-700"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-[#1a1a1a] text-gray-400">Or continue with</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-4">
//               <button
//                 onClick={() => window.google?.accounts.id.prompt()}
//                 className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
//               >
//                 <FcGoogle className="text-2xl group-hover:scale-110 transition-transform duration-300" />
//                 <span className="ml-2 text-white">Google</span>
//               </button>
//               <button
//                 onClick={handleFacebookLogin}
//                 className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
//               >
//                 <BsFacebook className="text-2xl text-blue-500 group-hover:scale-110 transition-transform duration-300" />
//                 <span className="ml-2 text-white">Facebook</span>
//               </button>
//             </div>
//           </div>

//           <p className="mt-8 text-center text-gray-400">
//             Don't have an account?{' '}
//             <Link to="/signup" className="text-[#2AF598] hover:text-[#009EFD] transition-colors">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import { RiMentalHealthFill } from 'react-icons/ri';
import ApiService from '../services/api';
import { useUser } from '../context/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    // Initialize Google Sign-In
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin
        });
      };
    };

    // Initialize Facebook SDK
    const loadFacebookScript = () => {
      window.fbAsyncInit = function() {
        window.FB?.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    loadGoogleScript();
    loadFacebookScript();

    return () => {
      // Cleanup scripts
      const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      const facebookScript = document.querySelector('script[src="https://connect.facebook.net/en_US/sdk.js"]');
      if (googleScript) googleScript.remove();
      if (facebookScript) facebookScript.remove();
    };
  }, []);

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { user } = await ApiService.login(
        formData.email,
        formData.password,
        rememberMe
      );
      setUser(user);
      navigate('/home');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const { user } = await ApiService.socialLogin(
        'google',
        response.credential,
        rememberMe
      );
      setUser(user);
      navigate('/home');
    } catch (error) {
      setError('Google login failed. Please try again.');
    }
  };

  const handleFacebookLogin = () => {
    window.FB?.login(async function(response) {
      if (response.authResponse) {
        try {
          const { user } = await ApiService.socialLogin(
            'facebook',
            response.authResponse.accessToken,
            rememberMe
          );
          setUser(user);
          navigate('/home');
        } catch (error) {
          setError('Facebook login failed. Please try again.');
        }
      }
    }, {scope: 'public_profile,email'});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2AF598]/10 to-[#009EFD]/10 pointer-events-none" />
        
        <div className="relative">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <RiMentalHealthFill size={48} className="text-[#2AF598]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue to Medical Bot</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center space-x-2 animate-shake">
              <BiErrorCircle className="text-red-500 text-xl flex-shrink-0" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#2AF598] focus:outline-none transition-colors duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#2AF598] focus:outline-none transition-colors duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <BsEyeSlashFill size={20} /> : <BsEyeFill size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-[#2AF598] focus:ring-[#2AF598] focus:ring-offset-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-[#2AF598] hover:text-[#009EFD] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white font-semibold hover:shadow-lg transition-all duration-300 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a] text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => window.google?.accounts.id.prompt()}
                className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
              >
                <FcGoogle className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                <span className="ml-2 text-white">Google</span>
              </button>
              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
              >
                <BsFacebook className="text-2xl text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="ml-2 text-white">Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#2AF598] hover:text-[#009EFD] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;