import React, { useState, useEffect } from 'react';
import './specAirportPage.css';

function SpecAirportPage() {
    const [airportIataCode, setAirportIataCode] = useState('');
    const [addAirportResult, setAddAirportResult] = useState('');

    const handleShowAirportDetails = () => {
        fetch(`http://localhost:8081/airport/${airportIataCode}`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0].IATA && data[0].City && data[0].Name) {
                    const resultString = `IATA: ${data[0].IATA}<br> City: ${data[0].City}<br> Name: ${data[0].Name}`;
                    console.log(resultString);
                    setAddAirportResult(resultString);
                } else {
                    throw new Error('Data structure is not as expected');
                }
            })
            .catch(error => console.error('Error:', error));
    };
    
  return (
    <div>
    <div className="landing-page">
      <div className="airport-specifics-page">
        <div className="airport-specifics-head">Airport specifics</div>
        <div className="airport-specifics-view-data">
          <div className="airport-specifics-details-head"></div>
          <div className="airport-specifics-view-details-form">
                <form>
                    <label htmlFor="IATA Code">IATA Code: </label>
                    <input type="text" name="IATA Code" id="IATA Code" value={airportIataCode} onChange={(e) => setAirportIataCode(e.target.value)} />
                    <div className="airport-specifics-view-button-container">
                        <button type="button" className="button" onClick={handleShowAirportDetails}>
                            Show details
                        </button>
                    </div>
                </form>
            </div>
            {addAirportResult && (
                <div className="airport-specifics-view-result" dangerouslySetInnerHTML={{ __html: addAirportResult }} />
            )}
            </div>
        </div>
    </div>
    </div>
  );
}

export default SpecAirportPage;
