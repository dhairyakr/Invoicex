import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPage from './AuthPage';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Navigation will be handled by the auth context
    // This is just for any additional success handling if needed
  };

  return <AuthPage isLogin={false} onSuccess={handleSuccess} />;
};

export default SignUpPage;