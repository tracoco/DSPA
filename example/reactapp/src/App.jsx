import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMessage = (e) => {
      setMessage(e.detail);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div>
      <h1>React App</h1>
      <p>Message from Angular:</p>
      <textarea value={message} readOnly rows="4" cols="50" />
    </div>
  );
}

export default App;
