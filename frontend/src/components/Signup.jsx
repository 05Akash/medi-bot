import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { BiErrorCircle, BiCheckCircle } from 'react-icons/bi';
import { RiMentalHealthFill } from 'react-icons/ri';
import ApiService from '../services/api';
import { useUser } from '../context/UserContext';

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignup
        });
      };
    };

    // Initialize Facebook SDK
    const loadFacebookScript = () => {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: process.env.REACT_APP_FACEBOOK_APP_ID,
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
  }, []);

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
    return requirements;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    const passwordRequirements = validatePassword(formData.password);
    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError('Please ensure your password meets all requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await ApiService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, rememberMe);
      
      localStorage.setItem('rememberMe', rememberMe);
      setUser(response.user);
      navigate('/home');
    } catch (err) {
      setError(err.error || 'An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (response) => {
    try {
      const result = await ApiService.socialLogin('google', response.credential);
      setUser(result.user);
      navigate('/home');
    } catch (error) {
      setError('Google signup failed. Please try again.');
    }
  };

  const handleFacebookSignup = () => {
    window.FB.login(async function(response) {
      if (response.authResponse) {
        try {
          const result = await ApiService.socialLogin('facebook', response.authResponse.accessToken);
          setUser(result.user);
          navigate('/home');
        } catch (error) {
          setError('Facebook signup failed. Please try again.');
        }
      }
    }, {scope: 'public_profile,email'});
  };

  const requirements = validatePassword(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2AF598]/10 to-[#009EFD]/10 pointer-events-none" />
        
        <div className="relative">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <RiMentalHealthFill size={48} className="text-[#2AF598]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join Medical Bot today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center space-x-2 animate-shake">
              <BiErrorCircle className="text-red-500 text-xl flex-shrink-0" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#2AF598] focus:outline-none transition-colors duration-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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

              {/* Password Requirements Checklist */}
              <div className="mt-2 space-y-2">
                {Object.entries(requirements).map(([key, met]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {met ? (
                      <BiCheckCircle className="text-green-500" />
                    ) : (
                      <BiErrorCircle className="text-gray-400" />
                    )}
                    <span className={`text-sm ${met ? 'text-green-500' : 'text-gray-400'}`}>
                      {key === 'length' && 'At least 8 characters'}
                      {key === 'uppercase' && 'One uppercase letter'}
                      {key === 'lowercase' && 'One lowercase letter'}
                      {key === 'number' && 'One number'}
                      {key === 'special' && 'One special character (!@#$%^&*)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#2AF598] focus:outline-none transition-colors duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <BsEyeSlashFill size={20} /> : <BsEyeFill size={20} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#2AF598] focus:ring-[#2AF598]"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-400">
                Remember me
              </label>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#2AF598] focus:ring-[#2AF598]"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I accept the <Link to="/terms" className="text-[#2AF598] hover:text-[#1ed488]">Terms and Conditions</Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Social Sign-up Options */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a] text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => window.google.accounts.id.prompt()}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <FcGoogle size={20} />
                <span className="text-white">Google</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookSignup}
                className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <BsFacebook size={20} className="text-blue-500" />
                <span className="text-white">Facebook</span>
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2AF598] hover:text-[#1ed488]">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;