import React, { useState } from 'react';
import translations from '../translations';

function ActivityTracker({ activities, setActivities, language }) {
  const t = translations[language];
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    category: '',
    duration: '',
    notes: ''
  });
  
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  
  // Get translated categories based on language
  const getTranslatedCategory = (category) => {
    switch(category) {
      case 'Exercise': return language === 'ru' ? 'Упражнения' : 'Exercise';
      case 'Work': return language === 'ru' ? 'Работа' : 'Work';
      case 'Study': return language === 'ru' ? 'Учеба' : 'Study';
      case 'Leisure': return language === 'ru' ? 'Отдых' : 'Leisure';
      case 'Social': return language === 'ru' ? 'Общение' : 'Social';
      case 'Hobby': return language === 'ru' ? 'Хобби' : 'Hobby';
      case 'Family': return language === 'ru' ? 'Семья' : 'Family';
      case 'Chores': return language === 'ru' ? 'Домашние дела' : 'Chores';
      case 'Self-care': return language === 'ru' ? 'Забота о себе' : 'Self-care';
      case 'Other': return language === 'ru' ? 'Другое' : 'Other';
      default: return category;
    }
  };
  
  // Activity categories
  const categories = [
    'Exercise',
    'Work',
    'Study',
    'Leisure',
    'Social',
    'Hobby',
    'Family',
    'Chores',
    'Self-care',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editing !== null) {
      // Update existing activity
      const updatedActivities = [...activities];
      updatedActivities[editing] = formData;
      setActivities(updatedActivities);
      setEditing(null);
    } else {
      // Add new activity
      setActivities([...activities, formData]);
    }
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      name: '',
      category: '',
      duration: '',
      notes: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(activities[index]);
    setEditing(index);
  };

  const handleDelete = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      name: '',
      category: '',
      duration: '',
      notes: ''
    });
  };
  
  // Filter activities
  const filteredActivities = filter === 'all' 
    ? activities
    : activities.filter(activity => activity.category === filter);
  
  // Calculate total time spent
  const totalDuration = filteredActivities.reduce((sum, activity) => 
    sum + (parseInt(activity.duration) || 0), 0);
  
  // Calculate category durations
  const categoryDurations = categories.map(category => {
    const total = activities
      .filter(activity => activity.category === category)
      .reduce((sum, activity) => sum + (parseInt(activity.duration) || 0), 0);
    
    return { category, total };
  }).filter(item => item.total > 0)
    .sort((a, b) => b.total - a.total);

  // Format duration in hours and minutes
  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (language === 'ru') {
      return `${hrs > 0 ? `${hrs}ч ` : ''}${mins}м`;
    } else {
      return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
    }
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header">
            {editing !== null ? t.editActivity : t.addActivity}
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
                <label htmlFor="name" className="form-label">{t.name}</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="category" className="form-label">{t.category}</label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">{language === 'ru' ? 'Выберите категорию' : 'Select a category'}</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {getTranslatedCategory(category)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">{t.duration} ({language === 'ru' ? 'минуты' : 'minutes'})</label>
                <input
                  type="number"
                  className="form-control"
                  id="duration"
                  name="duration"
                  min="1"
                  value={formData.duration}
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
                  rows="2"
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
        
        <div className="card">
          <div className="card-header">{language === 'ru' ? 'Сводка Активностей' : 'Activity Summary'}</div>
          <div className="card-body">
            <h5 className="card-title">{language === 'ru' ? 'Общее Время' : 'Total Time'}: {formatDuration(totalDuration)}</h5>
            
            <h6 className="mt-4">{language === 'ru' ? 'Основные Категории:' : 'Top Categories:'}</h6>
            <ul className="list-group">
              {categoryDurations.slice(0, 5).map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {getTranslatedCategory(item.category)}
                  <span className="badge bg-primary rounded-pill">
                    {formatDuration(item.total)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="col-md-8">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>{t.activities}</span>
            <div className="dropdown">
              <select 
                className="form-select form-select-sm" 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{width: '150px'}}
              >
                <option value="all">{language === 'ru' ? 'Все Категории' : 'All Categories'}</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {getTranslatedCategory(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            {filteredActivities.length === 0 ? (
              <p className="text-muted">
                {language === 'ru' ? 'Активности еще не записаны.' : 'No activities recorded yet.'}
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      <th>{language === 'ru' ? 'Активность' : 'Activity'}</th>
                      <th>{t.category}</th>
                      <th>{t.duration}</th>
                      <th>{t.notes}</th>
                      <th>{language === 'ru' ? 'Действия' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredActivities].reverse().map((activity, index) => (
                      <tr key={index}>
                        <td>{new Date(activity.date).toLocaleDateString(locale)}</td>
                        <td>{activity.name}</td>
                        <td>{getTranslatedCategory(activity.category)}</td>
                        <td>{formatDuration(parseInt(activity.duration))}</td>
                        <td>{activity.notes}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => {
                              const realIndex = activities.findIndex(
                                a => a.date === activity.date && 
                                    a.name === activity.name && 
                                    a.category === activity.category && 
                                    a.duration === activity.duration
                              );
                              handleEdit(realIndex);
                            }}
                          >
                            {t.edit}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              const realIndex = activities.findIndex(
                                a => a.date === activity.date && 
                                    a.name === activity.name && 
                                    a.category === activity.category && 
                                    a.duration === activity.duration
                              );
                              handleDelete(realIndex);
                            }}
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

export default ActivityTracker;