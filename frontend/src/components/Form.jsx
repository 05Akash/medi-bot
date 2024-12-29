import React, { useState, useEffect } from "react";
import { CheckCircle, Loader } from "lucide-react";
import { useUser } from '../context/UserContext';
import ApiService from '../services/api';

const Form = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    bloodGroup: "",
    height: "",
    weight: "",
    medicalCondition: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Fetch existing profile data when component mounts
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getProfile();
        const profileData = response.user;
        
        setFormData({
          name: profileData.name || "",
          gender: profileData.gender || "",
          age: profileData.age || "",
          bloodGroup: profileData.blood_group || "",
          height: profileData.height || "",
          weight: profileData.weight || "",
          medicalCondition: profileData.medical_condition || "",
        });
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await ApiService.updateProfile(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader className="w-8 h-8 text-[#2AF598] animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div className={`p-8 rounded-lg ${
          darkMode 
            ? "bg-[#1a1a1a] border border-gray-700" 
            : "bg-white shadow-lg"
        }`}>
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#2AF598] to-[#009EFD] bg-clip-text text-transparent">
            User Information
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields remain the same as in your original component */}
            {/* ... */}

            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white font-medium rounded-lg transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#2AF598] disabled:opacity-50"
              disabled={loading || isSubmitted}
            >
              {isSubmitted ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Saved Successfully!
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;