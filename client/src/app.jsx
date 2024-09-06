import React, { useState, useCallback, useEffect } from 'react';
import { BsPerson } from "react-icons/bs";
import { IoCopyOutline } from "react-icons/io5";
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
  const [ipt, setIpt] = useState('');
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

  const submit = useCallback((e) => {
    e.preventDefault();
    if (isSubmitDisabled) {
      return;
    }
    setRes({ status: false });
    if (!ipt) {
      return setRes({
        status: true,
        msg: 'Please enter your WhatsApp number with country code',
        is: 'error'
      });
    }
    setIsSubmitDisabled(true);
    setCountdown(120);  

    setTimeout(() => {
      const mockCode = "123-456"; 
      setRes({
        status: true,
        msg: `pair code: ${mockCode}`,
        is: 'info'
      });
    }, 1000);

     fetch(`/pair?phone=${encodeURIComponent(ipt)}`)
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
  }, [ipt, isSubmitDisabled]);

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
          placeholder="917788861848"
          value={ipt}
          onChange={(e) => setIpt(e.target.value)}
        />
        <button type="submit" disabled={isSubmitDisabled}>
          {isSubmitDisabled ? `Wait ${countdown}s` : 'Get code'}
        </button>
      </form>
    </div>
  );
};

export default App;