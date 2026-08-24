import { useEffect, useState } from 'react';

function TestApi() {
  const [message, setMessage] = useState("Loading...");

  async function fetchData() {
    try {
      const result = await fetch('http://localhost:3000/api/hello');
      const data = await result.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error fetching hello API:", error);
      setMessage("Error connecting to API");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Test API Result</h2>
      <p>Message: {message}</p>
    </div>
  );
}

export default TestApi;