import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from './AuthPage';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigation will be handled by the auth context
    // This is just for any additional success handling if needed
  };

  return <AuthPage isLogin={true} onSuccess={handleSuccess} />;
};

export default LoginPage;