import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login({ translations }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login, register } = useAuth();

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMessage('');
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (isLoginMode) {
      // Login logic
      if (!username || !password) {
        setError(translations.loginRequiredFields);
        return;
      }

      const success = login(username, password);
      if (!success) {
        setError(translations.loginFailed);
      }
    } else {
      // Registration logic
      const result = register(username, password, confirmPassword);
      
      if (!result.success) {
        // Display appropriate error message based on error code
        switch (result.error) {
          case 'allFieldsRequired':
            setError(translations.allFieldsRequired);
            break;
          case 'passwordsMismatch':
            setError(translations.passwordsMismatch);
            break;
          case 'usernameTaken':
            setError(translations.usernameTaken);
            break;
          default:
            setError(translations.loginFailed);
        }
        return;
      }
      
      // Registration successful
      setSuccessMessage(translations.registrationSuccess);
      setIsLoginMode(true);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">
        {isLoginMode ? translations.login : translations.register}
      </h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">{translations.username}</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">{translations.password}</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {!isLoginMode && (
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              {translations.confirmPassword}
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}
        
        <button type="submit" className="btn btn-primary w-100 mb-3">
          {isLoginMode ? translations.login : translations.createAccount}
        </button>
        
        <div className="text-center">
          <button 
            type="button" 
            className="btn btn-link" 
            onClick={switchMode}
          >
            {isLoginMode ? translations.dontHaveAccount : translations.alreadyHaveAccount}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;