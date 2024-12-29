import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Hero.module.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className={`${styles["min-h-screen"]} relative overflow-hidden`}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className={`${styles["fade-up"]} text-4xl sm:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#2AF598] to-[#009EFD]`}>
            Welcome to MediBot
          </h1>
          <p className={`${styles["fade-up"]} mb-8 text-xl sm:text-4xl text-gray-300`}>
            Revolutionizing Healthcare with AI-Powered Assistance.
          </p>

          <div className={`${styles["fade-up"]} flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8`}>
            <Link
              to="/login"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#2AF598] to-[#009EFD] text-white rounded-full hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
            >
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>Login</span>
            </Link>

            <Link
              to="/signup"
              className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </Link>
          </div>

          <div className={`${styles["horizontal-scroll-container"]} mt-16`}>
            <div className={`${styles["horizontal-scroll-content"]}`}>
              {[
                {
                  title: "Medical Analysis",
                  icon: "🔬",
                  description: "Advanced AI-powered medical analysis"
                },
                {
                  title: "Quick Diagnosis",
                  icon: "🏥",
                  description: "Preliminary health assessments"
                },
                {
                  title: "24/7 Support",
                  icon: "⚕️",
                  description: "Round-the-clock medical assistance"
                },
                {
                  title: "Health Records",
                  icon: "📋",
                  description: "Secure medical history tracking"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${styles["horizontal-scroll-item"]} bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 mx-4`}
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;