import React, { useState, useCallback, useEffect } from 'react';
import { BsPerson } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
import './App.css';

const Alert = ({ variant, children }) => (
  <div className={`alert ${variant}`}>
    {children}
    <IoCopyOutline className="copy" onClick={() => handleCopy(children)} />
  </div>
);

const handleCopy = (textToCopy) => {
  const textWithoutLabel = textToCopy.replace('pair code:', '').replace('session id:', '').trim();
  navigator.clipboard.writeText(textWithoutLabel)
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
    phone: ''
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sessionId, setSessionId] = useState('');

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

  // Setup WebSocket connection when pairing code is shown
  useEffect(() => {
    let ws;
    if (res.status && res.is === 'info' && !sessionId) {
      ws = new WebSocket(`ws://${window.location.host}`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setRes({
          status: true,
          msg: 'Failed to establish connection for updates',
          is: 'error'
        });
      };
    }
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [res.status, res.is]);

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
    setSessionId('');

    if (!formData.phone) {
      return setRes({
        status: true,
        msg: 'Please enter your WhatsApp number with country code',
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
        phone: formData.phone
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
        {sessionId && (
          <Alert variant="info">
            {`session id: ${sessionId}`}
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

        <button type="submit" disabled={isSubmitDisabled}>
          {isSubmitDisabled ? `Wait ${countdown}s` : 'Get code'}
        </button>
      </form>
    </div>
  );
};

export default App;