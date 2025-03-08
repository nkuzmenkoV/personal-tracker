import React, { useState } from 'react';
import translations from '../translations';

function ExpenseTracker({ expenses, setExpenses, language }) {
  const t = translations[language];
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: ''
  });
  
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  
  // Get translated categories based on language
  const getTranslatedCategory = (category) => {
    switch(category) {
      case 'Food': return language === 'ru' ? 'Еда' : 'Food';
      case 'Housing': return language === 'ru' ? 'Жилье' : 'Housing';
      case 'Transportation': return language === 'ru' ? 'Транспорт' : 'Transportation';
      case 'Utilities': return language === 'ru' ? 'Коммунальные услуги' : 'Utilities';
      case 'Entertainment': return language === 'ru' ? 'Развлечения' : 'Entertainment';
      case 'Shopping': return language === 'ru' ? 'Покупки' : 'Shopping';
      case 'Healthcare': return language === 'ru' ? 'Здравоохранение' : 'Healthcare';
      case 'Education': return language === 'ru' ? 'Образование' : 'Education';
      case 'Personal Care': return language === 'ru' ? 'Личная гигиена' : 'Personal Care';
      case 'Travel': return language === 'ru' ? 'Путешествия' : 'Travel';
      case 'Gifts/Donations': return language === 'ru' ? 'Подарки/Пожертвования' : 'Gifts/Donations';
      case 'Other': return language === 'ru' ? 'Другое' : 'Other';
      default: return category;
    }
  };
  
  // Categories for expenses
  const categories = [
    'Food',
    'Housing',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Education',
    'Personal Care',
    'Travel',
    'Gifts/Donations',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editing !== null) {
      // Update existing expense
      const updatedExpenses = [...expenses];
      updatedExpenses[editing] = formData;
      setExpenses(updatedExpenses);
      setEditing(null);
    } else {
      // Add new expense
      setExpenses([...expenses, formData]);
    }
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      description: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(expenses[index]);
    setEditing(index);
  };

  const handleDelete = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      description: ''
    });
  };
  
  // Filter expenses
  const filteredExpenses = filter === 'all' 
    ? expenses
    : expenses.filter(expense => expense.category === filter);
  
  // Calculate totals
  const totalAmount = filteredExpenses.reduce((sum, expense) => 
    sum + parseFloat(expense.amount || 0), 0);
  
  // Calculate category totals 
  const categoryTotals = categories.map(category => {
    const total = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    
    return { category, total };
  }).filter(item => item.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header">
            {editing !== null ? t.editExpense : t.addExpense}
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
                <label htmlFor="amount" className="form-label">{t.amount} ($)</label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  name="amount"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">{t.description}</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="2"
                  value={formData.description}
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
          <div className="card-header">{t.expenseSummary}</div>
          <div className="card-body">
            <h5 className="card-title">{t.total}: ${totalAmount.toFixed(2)}</h5>
            
            <h6 className="mt-4">{language === 'ru' ? 'Основные Категории:' : 'Top Categories:'}</h6>
            <ul className="list-group">
              {categoryTotals.slice(0, 5).map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {getTranslatedCategory(item.category)}
                  <span className="badge bg-primary rounded-pill">
                    ${item.total.toFixed(2)}
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
            <span>{t.expenses}</span>
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
            {filteredExpenses.length === 0 ? (
              <p className="text-muted">
                {language === 'ru' ? 'Расходы еще не записаны.' : 'No expenses recorded yet.'}
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      <th>{t.category}</th>
                      <th>{t.amount}</th>
                      <th>{t.description}</th>
                      <th>{language === 'ru' ? 'Действия' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredExpenses].reverse().map((expense, index) => (
                      <tr key={index}>
                        <td>{new Date(expense.date).toLocaleDateString(locale)}</td>
                        <td>{getTranslatedCategory(expense.category)}</td>
                        <td>${parseFloat(expense.amount).toFixed(2)}</td>
                        <td>{expense.description}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => {
                              const realIndex = expenses.findIndex(
                                e => e.date === expense.date && 
                                    e.category === expense.category && 
                                    e.amount === expense.amount && 
                                    e.description === expense.description
                              );
                              handleEdit(realIndex);
                            }}
                          >
                            {t.edit}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              const realIndex = expenses.findIndex(
                                e => e.date === expense.date && 
                                    e.category === expense.category && 
                                    e.amount === expense.amount && 
                                    e.description === expense.description
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

export default ExpenseTracker;