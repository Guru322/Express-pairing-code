import React, { useState, useCallback, useEffect } from 'react';
import { BsPerson } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
import { FaDatabase } from "react-icons/fa";
import './App.css';

const Alert = ({ variant, children }) => (
  <div className={`alert ${variant}`}>
    {children}
    {variant === 'info' && <IoCopyOutline className="copy" onClick={() => handleCopy(children)} />}
  </div>
);

const handleCopy = (textToCopy) => {
  navigator.clipboard.writeText(textToCopy.replace('pair code:', '').trim())
    .then(() => console.log("Text copied to clipboard"))
    .catch((err) => console.error("Failed to copy text: ", err));
};

const App = () => {
  const [res, setRes] = useState({
    status: false,
    msg: '',
    is: ''
  });
  const [formData, setFormData] = useState({
    phone: '',
    mongoUrl: '',
    dbName: ''
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsSubmitDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submit = useCallback((e) => {
    e.preventDefault();
    if (isSubmitDisabled) {
      return;
    }
    setRes({ status: false });

    if (!formData.phone) {
      return setRes({
        status: true,
        msg: 'Please enter your WhatsApp number with country code',
        is: 'error'
      });
    }

    if (!formData.mongoUrl) {
      return setRes({
        status: true,
        msg: 'Please enter the MongoDB URL',
        is: 'error'
      });
    }

    if (!formData.dbName) {
      return setRes({
        status: true,
        msg: 'Please enter the Database Name',
        is: 'error'
      });
    }

    setIsSubmitDisabled(true);
    setCountdown(120);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: formData.phone,
        mongoUrl: formData.mongoUrl,
        dbName: formData.dbName
      })
    };

    fetch('/pair', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.code) {
          setRes({
            status: true,
            msg: `pair code: ${data.code}`,
            is: 'info'
          });
        } else {
          setRes({
            status: true,
            msg: data.error || 'Failed to retrieve pair code',
            is: 'error'
          });
        }
      })
      .catch((err) => {
        setRes({
          status: true,
          msg: err.message,
          is: 'error'
        });
      });
  }, [formData, isSubmitDisabled]);

  return (
    <div className="container">
      <form onSubmit={submit}>
        <BsPerson className="icon" />
        <h1>Link devices!</h1>
        {res.status && (
          <Alert variant={res.is}>
            {res.msg}
          </Alert>
        )}
        <label>Phone number</label>
        <input
          type="number"
          name="phone"
          placeholder="917788861848"
          value={formData.phone}
          onChange={handleInputChange}
        />

        <label>MongoDB URL</label>
        <input
          type="text"
          name="mongoUrl"
          placeholder="mongodb://username:password@host:port/database"
          value={formData.mongoUrl}
          onChange={handleInputChange}
        />

        <label>Database Name</label>
        <input
          type="text"
          name="dbName"
          placeholder="your-database-name"
          value={formData.dbName}
          onChange={handleInputChange}
        />

        <button type="submit" disabled={isSubmitDisabled}>
          {isSubmitDisabled ? `Wait ${countdown}s` : 'Get code'}
        </button>
      </form>
    </div>
  );
};

export default App;
