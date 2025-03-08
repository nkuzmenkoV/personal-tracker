import React from 'react';
import translations from '../translations';

function Dashboard({ dailyData, expenses, activities, language }) {
  const t = translations[language];
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, exp) => total + parseFloat(exp.amount || 0), 0);
  
  // Calculate average mood if we have mood data
  const moods = dailyData.filter(item => item.mood).map(item => parseInt(item.mood));
  const avgMood = moods.length ? (moods.reduce((sum, mood) => sum + mood, 0) / moods.length).toFixed(1) : 'N/A';
  
  // Calculate total exercise time
  const totalExercise = dailyData.reduce((total, entry) => total + parseInt(entry.exercise || 0), 0);
  
  // Find most recent entries
  const latestDailyEntry = dailyData.length ? dailyData[dailyData.length - 1] : null;
  const latestExpense = expenses.length ? expenses[expenses.length - 1] : null;
  const latestActivity = activities.length ? activities[activities.length - 1] : null;
  
  // Format date for welcome message
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  const formattedDate = today.toLocaleDateString(locale, options);

  return (
    <div>
      <div className="alert alert-info mb-4 welcome-alert">
        <h4 className="alert-heading">{language === 'ru' ? 'Добро пожаловать в ваш Персональный Трекер!' : 'Welcome to Your Personal Tracker!'}</h4>
        <p className="welcome-text">{language === 'ru' ? `Сегодня ${formattedDate}. Отслеживайте свои ежедневные активности, расходы и самочувствие в одном месте.` : 
          `Today is ${formattedDate}. Track your daily activities, expenses, and well-being all in one place.`}</p>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card stat-card bg-light">
            <h3>{dailyData.length}</h3>
            <p>{language === 'ru' ? 'Дневные Записи' : 'Daily Entries'}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card bg-light">
            <h3>${totalExpenses.toFixed(2)}</h3>
            <p>{t.expenses}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card bg-light">
            <h3>{avgMood}</h3>
            <p>{language === 'ru' ? 'Среднее Настроение (1-10)' : 'Average Mood (1-10)'}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card bg-light">
            <h3>{totalExercise} {language === 'ru' ? 'мин' : 'min'}</h3>
            <p>{language === 'ru' ? 'Общее Время Упражнений' : 'Total Exercise Time'}</p>
          </div>
        </div>
      </div>
      
      <h4 className="mb-3">{t.recentActivities}</h4>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              {language === 'ru' ? 'Последняя Дневная Запись' : 'Latest Daily Entry'}
            </div>
            <div className="card-body">
              {latestDailyEntry ? (
                <>
                  <p><strong>{t.date}:</strong> {new Date(latestDailyEntry.date).toLocaleDateString(locale)}</p>
                  <p><strong>{t.mood}:</strong> {latestDailyEntry.mood}/10</p>
                  <p><strong>{language === 'ru' ? 'Сон' : 'Sleep'}:</strong> {latestDailyEntry.sleep} {language === 'ru' ? 'часов' : 'hours'}</p>
                  <p><strong>{language === 'ru' ? 'Вода' : 'Water'}:</strong> {latestDailyEntry.waterIntake} {language === 'ru' ? 'стаканов' : 'glasses'}</p>
                  <p><strong>{language === 'ru' ? 'Упражнения' : 'Exercise'}:</strong> {latestDailyEntry.exercise} {language === 'ru' ? 'минут' : 'minutes'}</p>
                  <p><strong>{t.notes}:</strong> {latestDailyEntry.notes}</p>
                </>
              ) : (
                <p className="text-muted">
                  {language === 'ru' ? 'Записей еще нет. Начните отслеживать свою ежедневную статистику!' : 
                  'No entries yet. Start tracking your daily stats!'}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white">
              {language === 'ru' ? 'Последняя Транзакция' : 'Latest Expense'}
            </div>
            <div className="card-body">
              {latestExpense ? (
                <>
                  <p><strong>{t.date}:</strong> {new Date(latestExpense.date).toLocaleDateString(locale)}</p>
                  <p><strong>{t.category}:</strong> {latestExpense.category}</p>
                  <p><strong>{t.amount}:</strong> ${parseFloat(latestExpense.amount || 0).toFixed(2)}</p>
                  <p><strong>{t.description}:</strong> {latestExpense.description}</p>
                </>
              ) : (
                <p className="text-muted">
                  {language === 'ru' ? 'Расходы еще не записаны. Начните отслеживать свои траты!' :
                  'No expenses recorded yet. Start tracking your spending!'}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-info text-white">
              {language === 'ru' ? 'Последняя Активность' : 'Latest Activity'}
            </div>
            <div className="card-body">
              {latestActivity ? (
                <>
                  <p><strong>{t.date}:</strong> {new Date(latestActivity.date).toLocaleDateString(locale)}</p>
                  <p><strong>{language === 'ru' ? 'Активность' : 'Activity'}:</strong> {latestActivity.name}</p>
                  <p><strong>{t.category}:</strong> {latestActivity.category}</p>
                  <p><strong>{t.duration}:</strong> {latestActivity.duration} {language === 'ru' ? 'минут' : 'minutes'}</p>
                  <p><strong>{t.notes}:</strong> {latestActivity.notes}</p>
                </>
              ) : (
                <p className="text-muted">
                  {language === 'ru' ? 'Активности еще не записаны. Начните отслеживать свои занятия!' :
                  'No activities recorded yet. Start tracking your activities!'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-light rounded tips-container">
        <h5 className="mb-3">{language === 'ru' ? 'Быстрые Советы' : 'Quick Tips'}</h5>
        <ul>
          <li>
            {language === 'ru' 
              ? <>Используйте вкладку <strong>{t.dailyData}</strong> для отслеживания показателей вашего здоровья и самочувствия</>
              : <>Use the <strong>{t.dailyData}</strong> tab to track your health and wellness metrics</>
            }
          </li>
          <li>
            {language === 'ru'
              ? <><strong>{t.moneyTracker}</strong> помогает вам категоризировать и контролировать ваши расходы</>
              : <>The <strong>{t.moneyTracker}</strong> helps you categorize and monitor your expenses</>
            }
          </li>
          <li>
            {language === 'ru'
              ? <>Отслеживайте, как вы проводите время, с трекером <strong>{t.activities}</strong></>
              : <>Track how you spend your time with the <strong>{t.activities}</strong> tracker</>
            }
          </li>
          <li>
            {language === 'ru' 
              ? <>Все данные хранятся локально в вашем браузере и не отправляются на какой-либо сервер</>
              : <>All data is stored locally in your browser and is not sent to any server</>
            }
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;