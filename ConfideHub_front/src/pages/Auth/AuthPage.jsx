import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppProvider';

const AuthPage = () => {
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);
  const [formData, setFormData] = useState({
    login: { username: '', password: '', remember: false },
    register: { username: '', email: '', password: '', confirmPassword: '', terms: false }
  });
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({
    login: { username: '', password: '' },
    register: { username: '', email: '', password: '', confirmPassword: '', terms: '' }
  });

  const colors = {
    primary: '#0066CC',
    secondary: '#FFAD03',
    accent: '#FD9148',
    white: '#FFFFFF'
  };

  // Password strength checker
  useEffect(() => {
    if (formData.register.password) {
      let strength = 0;

      // Length check
      if (formData.register.password.length >= 8) strength += 1;

      // Contains number
      if (/\d/.test(formData.register.password)) strength += 1;

      // Contains special character
      if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.register.password)) strength += 1;

      // Contains uppercase and lowercase
      if (/[a-z]/.test(formData.register.password) &&
        /[A-Z]/.test(formData.register.password)) strength += 1;

      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.register.password]);

  const handleInputChange = (formType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [formType]: {
        ...prev[formType],
        [field]: value
      }
    }));


    if (errors[formType][field]) {
      setErrors(prev => ({
        ...prev,
        [formType]: {
          ...prev[formType],
          [field]: ''
        }
      }));
    }
  };

  const togglePassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateLoginForm = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!formData.login.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.login.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(prev => ({
      ...prev,
      login: newErrors
    }));

    return isValid;
  };

  const validateRegisterForm = () => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: ''
    };
    let isValid = true;

    if (!formData.register.username) {
      newErrors.username = 'Full name is required';
      isValid = false;
    }

    if (!formData.register.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.register.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.register.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.register.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.register.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.register.password !== formData.register.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.register.terms) {
      newErrors.terms = 'You must agree to the terms';
      isValid = false;
    }

    setErrors(prev => ({
      ...prev,
      register: newErrors
    }));

    return isValid;
  };


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        navigate('/feed');
    }
}, [navigate]);


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    if (validateLoginForm()) {
      try {
        const response = await fetch('api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.login),
          credentials: 'include',
        });

        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        setUser(data.username);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/feed');
      } catch (error) {
        setLoginError(error.message);
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  //  Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    if (validateRegisterForm()) {
      try {
        const response = await fetch('api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData.register),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        setActiveTab('login');
      } catch (error) {
        setRegisterError(error.message);
        console.error('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
        {/* Header */}
        <div style={{ background: colors.primary }} className="p-6 text-center relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h1 className="text-white text-2xl font-bold">Confess</h1>
            </div>
            <p className="text-white text-sm mt-2 opacity-90">
              Share your thoughts anonymously
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full" style={{ background: colors.secondary, opacity: 0.3 }}></div>
          <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full" style={{ background: colors.accent, opacity: 0.2 }}></div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              className={`flex-1 py-2 rounded-md font-medium focus:outline-none transition-all duration-300 ${
                activeTab === 'login'
                  ? `text-white shadow-md` 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ backgroundColor: activeTab === 'login' ? colors.primary : 'transparent' }}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-md font-medium focus:outline-none transition-all duration-300 ${
                activeTab === 'register'
                  ? `text-white shadow-md` 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ backgroundColor: activeTab === 'register' ? colors.primary : 'transparent' }}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Login Form */}
            {activeTab === 'login' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleLoginSubmit}>
                  {loginError && (
                    <p className="mt-4 text-red-500 text-center">{loginError}</p>
                  )}

                  <div className="mb-4">
                    <label htmlFor="login-email" className="block text-gray-700 text-sm font-medium mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </span>
                      <input
                        id="login-email"
                        type="text"
                        value={formData.login.username}
                        onChange={(e) => handleInputChange('login', 'username', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border ${errors.login.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                        style={{ 
                          focusRing: colors.primary, 
                          focusBorder: colors.primary 
                        }}
                        placeholder="Username"
                      />
                    </div>
                    {errors.login.username && (
                      <p className="mt-1 text-sm text-red-500">{errors.login.username}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="login-password" className="block text-gray-700 text-sm font-medium">
                        Password
                      </label>
                      <a 
                        href="#" 
                        className="text-sm hover:underline"
                        style={{ color: colors.primary }}
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <input
                        id="login-password"
                        type={showPassword.login ? 'text' : 'password'}
                        value={formData.login.password}
                        onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border ${errors.login.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                        style={{ 
                          focusRing: colors.primary, 
                          focusBorder: colors.primary 
                        }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => togglePassword('login')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          {showPassword.login ? (
                            <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                          ) : (
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          )}
                          {showPassword.login ? (
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          ) : (
                            <path d="M2.458 12C3.732 16.057 7.523 19 12 19c4.478 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-4.477 0-8.268 2.943-9.542 7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                    {errors.login.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.login.password}</p>
                    )}
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={formData.login.remember}
                      onChange={(e) => handleInputChange('login', 'remember', e.target.checked)}
                      className="h-4 w-4 focus:ring-2 focus:ring-opacity-50 border-gray-300 rounded"
                      style={{ 
                        color: colors.primary,
                        focusRing: colors.primary
                      }}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-medium transition-all duration-300 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    style={{ 
                      background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})` 
                    }}
                  >
                    Sign In
                  </button>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                        style={{ focusRing: colors.primary }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                        style={{ focusRing: colors.primary }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                          <path fill="#3F51B5" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"/>
                          <path fill="#FFFFFF" d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                        style={{ focusRing: colors.primary }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                          <path d="M40.9,26.2c-0.1-0.8-0.3-1.6-0.7-2.7c-0.4-1.5-1-3.1-2-4.8c-2-3.5-5.3-6.9-9.1-6.9c-1.2,0-2.4,0.3-3.5,0.8 c-0.8,0.3-1.6,0.8-2.3,1.4c-0.5,0.4-0.9,0.9-1.4,1.5c-0.1-0.1-0.2-0.2-0.3-0.4c-0.5-0.6-1-1-1.5-1.4c-0.7-0.6-1.5-1-2.3-1.3 c-1.1-0.5-2.3-0.8-3.5-0.8c-3.8,0-7.2,3.4-9.1,6.9c-1,1.7-1.5,3.3-2,4.8c-0.4,1.2-0.6,2-0.7,2.7c-0.1,1.1-0.2,2.2-0.2,3.1 c0,2.1,0.5,3.8,1.4,5c0.4,0.5,0.9,0.9,1.4,1.2c1.4,0.8,3.1,1,4.8,1c1.7,0,3.4-0.2,4.8-1c0.5-0.3,1-0.7,1.4-1.2 c0.1-0.1,0.1-0.1,0.2-0.2c0,0.1,0.1,0.1,0.1,0.2c0.4,0.5,0.9,0.9,1.4,1.2c1.4,0.8,3.1,1,4.8,1c1.7,0,3.4-0.2,4.8-1 c0.5-0.3,1-0.7,1.4-1.2c0.9-1.1,1.4-2.8,1.4-5C41.1,28.4,41,27.3,40.9,26.2z"/>
                          <path fill="#212121" d="M24.1,10.6c-0.4,0.4-0.9,0.9-1.4,1.5c-0.1-0.1-0.2-0.2-0.3-0.4c-0.5-0.6-1-1-1.5-1.4 C16.3,6.2,9,9.7,5.1,17.2c-1,1.7-1.5,3.3-2,4.8c-0.4,1.2-0.6,2-0.7,2.7c-0.1,1.1-0.2,2.2-0.2,3.1c0,2.1,0.5,3.8,1.4,5 c0.4,0.5,0.9,0.9,1.4,1.2c1.4,0.8,3.1,1,4.8,1c1.7,0,3.4-0.2,4.8-1c0.5-0.3,1-0.7,1.4-1.2c0.1-0.1,0.1-0.1,0.2-0.2 c0,0.1,0.1,0.1,0.1,0.2c0.4,0.5,0.9,0.9,1.4,1.2c1.4,0.8,3.1,1,4.8,1c1.7,0,3.4-0.2,4.8-1c0.5-0.3,1-0.7,1.4-1.2 c0.9-1.1,1.4-2.8,1.4-5c0-0.9-0.1-2-0.2-3.1c-0.1-0.8-0.3-1.6-0.7-2.7c-0.4-1.5-1-3.1-2-4.8C33.7,11.6,27.8,7.2,24.1,10.6z M29.2,20.2c1.1,0,2,0.9,2,2c0,1.1-0.9,2-2,2c-1.1,0-2-0.9-2-2C27.2,21.1,28.1,20.2,29.2,20.2z M17.8,20.2c1.1,0,2,0.9,2,2 c0,1.1-0.9,2-2,2c-1.1,0-2-0.9-2-2C15.8,21.1,16.7,20.2,17.8,20.2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleRegisterSubmit}>
                  {registerError && (
                    <p className="mt-4 text-red-500 text-center">{registerError}</p>
                  )}

                  <div className="mb-4">
                    <label htmlFor="register-name" className="block text-gray-700 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <input
                        id="register-name"
                        type="text"
                        value={formData.register.username}
                        onChange={(e) => handleInputChange('register', 'username', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border ${errors.register.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                        style={{ 
                          focusRing: colors.primary, 
                          focusBorder: colors.primary 
                        }}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.register.username && (
                      <p className="mt-1 text-sm text-red-500">{errors.register.username}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="register-email" className="block text-gray-700 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </span>
                      <input
                        id="register-email"
                        type="email"
                        value={formData.register.email}
                        onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                        className={`w-full pl-10 pr-3 py-2 border ${errors.register.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                        style={{ 
                          focusRing: colors.primary, 
                          focusBorder: colors.primary 
                        }}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.register.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.register.email}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="register-password" className="block text-gray-700 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <input
                        id="register-password"
                        type={showPassword.register ? 'text' : 'password'}
                        value={formData.register.password}
                        onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border ${errors.register.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                        style={{ 
                          focusRing: colors.primary, 
                          focusBorder: colors.primary 
                        }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => togglePassword('register')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          {showPassword.register ? (
                            <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                          ) : (
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          )}
                          {showPassword.register ? (
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          ) : (
                            <path d="M2.458 12C3.732 16.057 7.523 19 12 19c4.478 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-4.477 0-8.268 2.943-9.542 7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                    {errors.register.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.register.password}</p>
                    )}
                    <div className="mt-2 flex">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level}
                          className={`h-1 flex-1 rounded-full mx-0.5 transition-all duration-300 ${
                            passwordStrength >= level 
                              ? level === 1 
                                ? 'bg-red-500' 
                                : level === 2 
                                  ? 'bg-orange-500' 
                                  : level === 3 
                                    ? 'bg-yellow-500' 
                                    : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {passwordStrength === 0 && "Must be at least 8 characters with numbers and symbols"}
                      {passwordStrength === 1 && "Weak - Add numbers or symbols"}
                      {passwordStrength === 2 && "Fair - Add uppercase/lowercase letters"}
                      {passwordStrength === 3 && "Good - Almost there"}
                      {passwordStrength === 4 && "Strong password!"}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <input
                        id="confirm-password"
                        type={showPassword.confirm ? 'text' : 'password'}
                        value={formData.register.confirmPassword}
                        onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border ${errors.register.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                        style={{ 
                          focusRing: colors.primary, 
                          focusBorder: colors.primary 
                        }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => togglePassword('confirm')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          {showPassword.confirm ? (
                            <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                          ) : (
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          )}
                          {showPassword.confirm ? (
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          ) : (
                            <path d="M2.458 12C3.732 16.057 7.523 19 12 19c4.478 0 8.268-2.943 9.542-7-1.274-4.057-5.064-7-9.542-7-4.477 0-8.268 2.943-9.542 7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                    {errors.register.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.register.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={formData.register.terms}
                      onChange={(e) => handleInputChange('register', 'terms', e.target.checked)}
                      className={`h-4 w-4 focus:ring-2 focus:ring-opacity-50 border-gray-300 rounded ${errors.register.terms ? 'border-red-500' : ''}`}
                      style={{ 
                        color: colors.primary,
                        focusRing: colors.primary
                      }}
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a 
                        href="#" 
                        className="hover:underline"
                        style={{ color: colors.primary }}
                      >
                        Terms
                      </a>{' '}
                      and{' '}
                      <a 
                        href="#" 
                        className="hover:underline"
                        style={{ color: colors.primary }}
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  {errors.register.terms && (
                    <p className="mt-1 mb-4 text-sm text-red-500">{errors.register.terms}</p>
                  )}

                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg font-medium transition-all duration-300 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      style={{ 
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})` 
                      }}
                    >
                      Create Account
                    </button>
                    <button
                      type="button"
                      className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50 flex justify-center items-center space-x-2"
                      style={{ 
                        focusRing: colors.primary
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                      </svg>
                      <span>Sign up with Google</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="hover:text-blue-600 text-sm transition-colors duration-300"
                style={{ color: colors.primary }}
              >
                Help
              </a>
              <a 
                href="#" 
                className="hover:text-blue-600 text-sm transition-colors duration-300"
                style={{ color: colors.primary }}
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="hover:text-blue-600 text-sm transition-colors duration-300"
                style={{ color: colors.primary }}
              >
                Terms
              </a>
            </div>
            <div className="text-gray-500 text-sm">© {new Date().getFullYear()} Confess App</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthPage;