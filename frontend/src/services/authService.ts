import axios from 'axios';

// Backend API URL
const API_URL = '/api/auth';

/**
 * 1. Register User Function
 * (calls /register endpoint in backend)
 */
const register = async (name: string, email: string, password: string) => {
  try {
    // axios.post(URL, data)
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    
    return response.data;

  } catch (error: any) {
    // 1. Smartly extract the error message
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
  
    console.error('Error during registration:', message);
    // 2. Instead of throwing the whole error object, throw only the message
    //    (or better, throw it as an object)
    throw { message: message };
  }
};

/**
 * 2. Login User Function
 * (calls /login endpoint in backend)
 */
const login = async (email: string, password: string) => {
  try {
    // axios.post(URL, data)
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
    }
    return response.data;

  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
                   
    console.error('Error during login:', message);
    // 2. Throw only the message
    throw { message: message };
  }
};

/**
 * 3. Logout User Function
 */
const logout = () => {
  localStorage.removeItem('userToken');
};

/**
 * 4. Forgot Password Request
 * (calls /forgot-password endpoint)
 */
const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, {
      email,
    });
    return response.data; // { message: 'If an account...' }
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    console.error('Error during forgot password request:', message);
    throw { message: message };
  }
};

/**
 * 5. Reset Password
 * (calls /reset-password/:token endpoint)
 */
const resetPassword = async (token: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, {
      password,
    });
    return response.data; // { message: 'Password reset successfully...' }
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || error.toString();
    console.error('Error during password reset:', message);
    throw { message: message };
  }
};

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;
