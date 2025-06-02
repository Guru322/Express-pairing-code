// Test script 
import fetch from 'node-fetch';

const testPairEndpoint = async () => {
  const url = 'http://localhost:8000/pair';
  const data = {
    phone: '', 
    mongoUrl: 'db://localhost:27017/baileys-test',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Response:', result);
  } catch (error) {
    console.error('Error testing pair endpoint:', error);
  }
};

console.log('Testing pair endpoint...');
testPairEndpoint();
