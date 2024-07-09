import { useEffect, useState } from 'react'

function App() {

  const [dataStr, setDataStr] = new useState("No data yet...");


  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765');

    ws.onopen = () => {
        console.log('WebSocket connection established');
    };
  
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setDataStr(JSON.stringify(data, null, 2));
        //console.log(event.data);
    };
  
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
  
    ws.onerror = (error) => {
        console.log('WebSocket error:', error);
    };
  }, [])

  return (
    <pre>
      {dataStr}
    </pre>
  )
}

export default App
