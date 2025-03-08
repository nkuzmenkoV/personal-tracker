import React, { useState, useEffect } from 'react';
import DailyDataForm from './components/DailyDataForm';
import ExpenseTracker from './components/ExpenseTracker';
import ActivityTracker from './components/ActivityTracker';
import Dashboard from './components/Dashboard';
import LanguageSelector from './components/LanguageSelector';
import ThemeSwitcher from './components/ThemeSwitcher';
import Login from './components/Login';
import TimestampConverter from './components/TimestampConverter';
import { useAuth } from './context/AuthContext';
import translations from './translations';

function App() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dailyData, setDailyData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');

  // Load data from localStorage on initial render
  useEffect(() => {
    const loadedDailyData = localStorage.getItem('dailyData');
    const loadedExpenses = localStorage.getItem('expenses');
    const loadedActivities = localStorage.getItem('activities');
    const savedLanguage = localStorage.getItem('language');
    const savedTheme = localStorage.getItem('theme');
    
    if (loadedDailyData) setDailyData(JSON.parse(loadedDailyData));
    if (loadedExpenses) setExpenses(JSON.parse(loadedExpenses));
    if (loadedActivities) setActivities(JSON.parse(loadedActivities));
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyData', JSON.stringify(dailyData));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('language', language);
    localStorage.setItem('theme', theme);
  }, [dailyData, expenses, activities, language, theme]);

  const t = translations[language];

  // If user is not logged in, show login screen
  if (!currentUser) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">{t.appTitle}</h1>
          <div className="d-flex align-items-center">
            <ThemeSwitcher 
              theme={theme} 
              setTheme={setTheme} 
              translations={t} 
            />
            <LanguageSelector 
              language={language} 
              setLanguage={setLanguage} 
              translations={translations} 
            />
          </div>
        </div>
        <Login translations={t} />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">{t.appTitle}</h1>
        <div className="d-flex align-items-center">
          <div className="me-3">
            <span className="me-2">{t.welcomeBack}, <b>{currentUser.username}</b></span>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={logout}
            >
              {t.logout}
            </button>
          </div>
          <ThemeSwitcher 
            theme={theme} 
            setTheme={setTheme} 
            translations={t} 
          />
          <LanguageSelector 
            language={language} 
            setLanguage={setLanguage} 
            translations={translations} 
          />
        </div>
      </div>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            {t.dashboard}
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'dailyData' ? 'active' : ''}`}
            onClick={() => setActiveTab('dailyData')}
          >
            {t.dailyData}
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            {t.moneyTracker}
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            {t.activities}
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'timestampConverter' ? 'active' : ''}`}
            onClick={() => setActiveTab('timestampConverter')}
          >
            {t.timestampConverter}
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            dailyData={dailyData} 
            expenses={expenses} 
            activities={activities} 
            language={language}
          />
        )}
        
        {activeTab === 'dailyData' && (
          <DailyDataForm 
            dailyData={dailyData} 
            setDailyData={setDailyData} 
            language={language}
          />
        )}
        
        {activeTab === 'expenses' && (
          <ExpenseTracker 
            expenses={expenses} 
            setExpenses={setExpenses} 
            language={language}
          />
        )}
        
        {activeTab === 'activities' && (
          <ActivityTracker 
            activities={activities} 
            setActivities={setActivities} 
            language={language}
          />
        )}
        
        {activeTab === 'timestampConverter' && (
          <TimestampConverter
            translations={t}
          />
        )}
      </div>
    </div>
  );
}

export default App;