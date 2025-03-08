import React, { useState } from 'react';

function TimestampConverter({ translations }) {
  const [timestamp, setTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [convertedTimestamp, setConvertedTimestamp] = useState('');
  const [convertedDate, setConvertedDate] = useState('');

  // Convert timestamp to date
  const convertToDate = () => {
    if (!timestamp) return;
    
    try {
      // Check if timestamp is in milliseconds or seconds
      const ts = timestamp.length > 10 ? parseInt(timestamp) : parseInt(timestamp) * 1000;
      const date = new Date(ts);
      
      if (isNaN(date.getTime())) {
        setConvertedDate(translations.invalidTimestamp);
        return;
      }
      
      setConvertedDate(date.toLocaleString());
    } catch (error) {
      setConvertedDate(translations.invalidTimestamp);
    }
  };

  // Convert date to timestamp
  const convertToTimestamp = () => {
    if (!dateString) return;
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        setConvertedTimestamp(translations.invalidDate);
        return;
      }
      
      setConvertedTimestamp({
        seconds: Math.floor(date.getTime() / 1000),
        milliseconds: date.getTime()
      });
    } catch (error) {
      setConvertedTimestamp(translations.invalidDate);
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-header">
            {translations.timestampToDate}
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="timestamp" className="form-label">{translations.enterTimestamp}</label>
              <input
                type="text"
                className="form-control"
                id="timestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder={translations.timestampPlaceholder}
              />
              <div className="form-text">{translations.timestampHint}</div>
            </div>
            <button 
              className="btn btn-primary"
              onClick={convertToDate}
            >
              {translations.convert}
            </button>
            {convertedDate && (
              <div className="mt-3">
                <h5>{translations.result}:</h5>
                <p className="mb-0">{convertedDate}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-header">
            {translations.dateToTimestamp}
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="dateString" className="form-label">{translations.enterDate}</label>
              <input
                type="datetime-local"
                className="form-control"
                id="dateString"
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={convertToTimestamp}
            >
              {translations.convert}
            </button>
            {convertedTimestamp && typeof convertedTimestamp === 'object' && (
              <div className="mt-3">
                <h5>{translations.result}:</h5>
                <p>{translations.seconds}: {convertedTimestamp.seconds}</p>
                <p className="mb-0">{translations.milliseconds}: {convertedTimestamp.milliseconds}</p>
              </div>
            )}
            {convertedTimestamp && typeof convertedTimestamp === 'string' && (
              <div className="mt-3">
                <h5>{translations.result}:</h5>
                <p className="mb-0">{convertedTimestamp}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimestampConverter;