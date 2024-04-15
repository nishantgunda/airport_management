import React, { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('http://localhost:8081/airport')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])
  return (
    <div>
      <table>
        <thead>
          <th>IATA</th>
          <th>Name</th>
          <th>City</th>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.IATA}</td>
              <td>{d.Name}</td>
              <td>{d.City}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App;