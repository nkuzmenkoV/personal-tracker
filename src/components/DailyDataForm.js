import React, { useState } from 'react';
import translations from '../translations';

function DailyDataForm({ dailyData, setDailyData, language }) {
  const t = translations[language];
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: '',
    sleep: '',
    waterIntake: '',
    exercise: '',
    notes: ''
  });
  
  const [editing, setEditing] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editing !== null) {
      // Update existing entry
      const updatedData = [...dailyData];
      updatedData[editing] = formData;
      setDailyData(updatedData);
      setEditing(null);
    } else {
      // Add new entry
      setDailyData([...dailyData, formData]);
    }
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mood: '',
      sleep: '',
      waterIntake: '',
      exercise: '',
      notes: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(dailyData[index]);
    setEditing(index);
  };

  const handleDelete = (index) => {
    const updatedData = dailyData.filter((_, i) => i !== index);
    setDailyData(updatedData);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mood: '',
      sleep: '',
      waterIntake: '',
      exercise: '',
      notes: ''
    });
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            {editing !== null ? t.editDailyData : t.addDailyData}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">{t.date}</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="mood" className="form-label">{t.mood} (1-10)</label>
                <input
                  type="number"
                  className="form-control"
                  id="mood"
                  name="mood"
                  min="1"
                  max="10"
                  value={formData.mood}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="sleep" className="form-label">{t.sleepHours}</label>
                <input
                  type="number"
                  className="form-control"
                  id="sleep"
                  name="sleep"
                  step="0.5"
                  min="0"
                  value={formData.sleep}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="waterIntake" className="form-label">{t.waterIntake}</label>
                <input
                  type="number"
                  className="form-control"
                  id="waterIntake"
                  name="waterIntake"
                  min="0"
                  value={formData.waterIntake}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="exercise" className="form-label">{t.exerciseMinutes}</label>
                <input
                  type="number"
                  className="form-control"
                  id="exercise"
                  name="exercise"
                  min="0"
                  value={formData.exercise}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="notes" className="form-label">{t.notes}</label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  {editing !== null ? t.save : t.add}
                </button>
                {editing !== null && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={cancelEdit}
                  >
                    {t.cancel}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">{language === 'ru' ? 'Дневные Записи' : 'Daily Entries'}</div>
          <div className="card-body">
            {dailyData.length === 0 ? (
              <p className="text-muted">
                {language === 'ru' 
                  ? 'Записей еще нет. Добавьте свою первую дневную запись!' 
                  : 'No entries yet. Add your first daily entry!'}
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      <th>{t.mood}</th>
                      <th>{language === 'ru' ? 'Сон' : 'Sleep'}</th>
                      <th>{language === 'ru' ? 'Вода' : 'Water'}</th>
                      <th>{language === 'ru' ? 'Упражнения' : 'Exercise'}</th>
                      <th>{language === 'ru' ? 'Действия' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...dailyData].reverse().map((entry, index) => (
                      <tr key={index}>
                        <td>{new Date(entry.date).toLocaleDateString(locale)}</td>
                        <td>{entry.mood}/10</td>
                        <td>{entry.sleep} {language === 'ru' ? t.hours : 'hrs'}</td>
                        <td>{entry.waterIntake} {language === 'ru' ? 'стаканов' : 'glasses'}</td>
                        <td>{entry.exercise} {language === 'ru' ? 'мин' : 'min'}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(dailyData.length - 1 - index)}
                          >
                            {t.edit}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(dailyData.length - 1 - index)}
                          >
                            {t.delete}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyDataForm;