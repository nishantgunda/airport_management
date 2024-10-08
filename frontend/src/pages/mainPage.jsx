import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import './mainPage.css';

function MainPage() {
    const [airportIataCode, setAirportIataCode] = useState('');
    const [airportAddIataCode, setAirportAddIataCode] = useState('');
    const [airportLocation, setAirportLocation] = useState('');
    const [airportName, setAirportName] = useState('');
    const [addAirportResult, setAddAirportResult] = useState('');
    const [companyID, setCompanyID] = useState('');
    const [companyAddID, setCompanyAddID] = useState('');
    const [companyLocation, setCompanyLocation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [addCompanyResult, setAddCompanyResult] = useState('');
    const [specificAirportIataCode, setSpecificAirportIataCode] = useState('');
    const [addSpecificAirportResult, setAddSpecificAirportResult] = useState('');
    const [fareFlightId, setfareFlightId] = useState('');
    const [faredeparture, setfaredeparture] = useState('');
    const [addfareResult, setAddFareResult] = useState('');
    var airportResultString;
    var FareString;
    const handlefarecalc = () => {
        fetch(`http://localhost:8081/fares/${fareFlightId}/${faredeparture}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                // Assuming the response structure is similar to an array of fares
                FareString='';
                for(var i=0;;i=i+1)
                {
                    if (data[0] && data[0][i] && data[0][i].net) {
                        FareString+= `${data[0][i].fare_plan}: ${data[0][i].net}<br>`;
                        //console.log(airportResultString);
                        setAddFareResult(FareString);
                    }
                    else if(data[0][i]==undefined)
                        break;
                     else {
                        throw new Error('Data structure is not as expected');
                    }
            }
            })
            .catch(error => console.error('Error:', error));
    };
    

    const handleShowSpecificAirportDetails = () => {
        fetch(`http://localhost:8081/airport/${specificAirportIataCode}`)
            .then(response => response.json())
            .then(data => {
                if (data && data[0].IATA && data[0].City && data[0].Name) {
                    airportResultString = `IATA: ${data[0].IATA}<br> City: ${data[0].City}<br> Name: ${data[0].Name}`;
                    //console.log(airportResultString);
                    setAddSpecificAirportResult(airportResultString);
                } else {
                    throw new Error('Data structure is not as expected');
                }
            })
            .catch(error => console.error('Error:', error));
        fetch(`http://localhost:8081/test/${specificAirportIataCode}`)
            .then(response => response.json())
            .then(data => {
                console.log(data[0])
                console.log(data)
                if (data && data[0][0].num) {
                    airportResultString += `<br>Number of runways: ${data[0][0].num}`;
                    console.log(airportResultString);
                    setAddSpecificAirportResult(airportResultString);
                } else {
                    throw new Error('Data structure is not as expected');
                }
            })
            .catch(error => console.error('Error:', error));
        fetch(`http://localhost:8081/lego/${specificAirportIataCode}`)
            .then(response => response.json())
            .then(data => {
                if(data[0] === undefined) {
                    airportResultString += `<br> No outgoing flights`;
                }
                else if (data && data[0].flight_id) {
                    airportResultString += `<br>Outgoing flights: ${data[0].flight_id}`;
                    console.log(airportResultString);
                    setAddSpecificAirportResult(airportResultString);
                } else {
                    throw new Error('Data structure is not as expected');
                }
            })
            .catch(error => console.error('Error:', error));
        fetch(`http://localhost:8081/legi/${specificAirportIataCode}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(data[0].flight_id);
                if(data[0] === undefined) {
                    airportResultString += `<br> No incoming flights`;
                }
                else if (data && data[0].flight_id) {
                    airportResultString += `<br>Incoming flights: ${data[0].flight_id}`;
                    console.log(airportResultString);
                    setAddSpecificAirportResult(airportResultString);
                } else {
                    throw new Error('Data structure is not as expected');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handleShowAirportDetails = () => {
        fetch(`http://localhost:8081/airport/${airportIataCode}`)
            .then(response => response.json())
            .then(data => {
                if(data[0] === undefined) {
                    const resultString = `No airport found.`
                    setAddAirportResult(resultString);
                } 
                else if (data && data[0].IATA && data[0].City && data[0].Name) {
                    const resultString = `IATA: ${data[0].IATA}<br> City: ${data[0].City}<br> Name: ${data[0].Name}`;
                    console.log(resultString);
                    setAddAirportResult(resultString);
                } else {
                    throw new Error('Data structure is not as expected');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handleAddAirportDetails = () => {
        fetch('http://localhost:8081/airport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ iataCode: airportAddIataCode, location: airportLocation, name: airportName }),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleShowCompanyDetails = () => {
        fetch(`http://localhost:8081/company/${companyID}`)
            .then(response => response.json())
            .then(data => {
                if(data[0] === undefined) {
                    const resultString = `No company found.`
                    setAddCompanyResult(resultString);
                } 
                else if (data && data[0].ID && data[0].Location && data[0].Name) {
                    const resultString = `ID: ${data[0].ID}<br> City: ${data[0].Location}<br> Name: ${data[0].Name}`;
                    console.log(resultString);
                    setAddCompanyResult(resultString);
                } else {
                    throw new Error('Data structure is not as expected');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handleAddCompanyDetails = () => {
        console.log('Company ID:', companyAddID);
        console.log('Location:', companyLocation);
        console.log('Name:', companyName);
        
        fetch('http://localhost:8081/company', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ companyID: companyAddID, location: companyLocation, name: companyName }),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error('Error:', error));
    };
    
  return (
    <div>
      <div className="landing-page">
        <div className="spline-object">
            <Spline scene = "https://prod.spline.design/lmNsbs8P1-Qk0E3z/scene.splinecode" />
        </div>
        <div className="landing-text">AIRPORT MANAGER</div>
        <div className="landing-paragraph">A comprehensive airport management system</div>
      </div>
      <div className="airport-details-page">
        <div className="airport-page-head">Airport details</div>
        <div className="airport-view-data">
          <div className="airport-details-head">Get airport data</div>
          <div className="airport-view-details-form">
                <form>
                    <label htmlFor="IATA Code">IATA Code: </label>
                    <input type="text" name="IATA Code" id="IATA Code" value={airportIataCode} onChange={(e) => setAirportIataCode(e.target.value)} />
                    <div className="airport-view-button-container">
                        <button type="button" className="button" onClick={handleShowAirportDetails}>
                            Show details
                        </button>
                    </div>
                </form>
            </div>
            {addAirportResult && (
                <div className="airport-view-result" dangerouslySetInnerHTML={{ __html: addAirportResult }} />
            )}
        </div>
        <div className="divider"></div>
        <div className="airport-add-data">
          <div className="airport-details-head">Add airport data</div>
          <div className="airport-add-details-form">
                <form>
                    <label htmlFor="IATA Code">IATA Code: </label>
                    <input type="text" name="IATA Code" id="IATA Code" value={airportAddIataCode} onChange={(e) => setAirportAddIataCode(e.target.value)} /><br />
                    <label htmlFor="Location">Location: </label>
                    <input type="text" name="Location" id="Location" value={airportLocation} onChange={(e) => setAirportLocation(e.target.value)} /><br />
                    <label htmlFor="Name">Name: </label>
                    <input type="text" name="Name" id="Name" value={airportName} onChange={(e) => setAirportName(e.target.value)} /><br />
                    <div className="airport-add-button-container">
                        <button type="button" className="button" onClick={handleAddAirportDetails}>
                            Add details
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div className="specific-airport-button-container">
          {/* <link to='./specAirportPage.jsx'>
            <button type="Specific airport details" className="button">
              Check specific airport details
            </button>
          </link> */}
        </div>
      </div>
      <div className="company-details-page">
        <div className="company-page-head">Company details</div>
        <div className="company-view-data">
          <div className="company-details-head">Get company data</div>
          <div className="company-view-details-form">
          <form>
                    <label htmlFor="Company ID">Company ID: </label>
                    <input type="text" name="Company ID" id="Company ID" value={companyID} onChange={(e) => setCompanyID(e.target.value)} />
                    <div className="company-view-button-container">
                        <button type="button" className="button" onClick={handleShowCompanyDetails}>
                            Show details
                        </button>
                    </div>
                </form>
          </div>
          {addCompanyResult && (
                <div className="company-view-result" dangerouslySetInnerHTML={{ __html: addCompanyResult }} />
            )}
        </div>
        <div className="divider"></div>
        <div className="company-add-data">
          <div className="company-details-head">Add company data</div>
          <div className="company-add-details-form">
          <form>
                    <label htmlFor="Company ID">Company ID: </label>
                    <input type="text" name="Company ID" id="Company ID" value={companyAddID} onChange={(e) => setCompanyAddID(e.target.value)} /><br />
                    <label htmlFor="Location">Location: </label>
                    <input type="text" name="Location" id="Location" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} /><br />
                    <label htmlFor="Name">Name: </label>
                    <input type="text" name="Name" id="Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} /><br />
                    <div className="company-add-button-container">
                        <button type="button" className="button" onClick={handleAddCompanyDetails}>
                            Add details
                        </button>
                    </div>
                </form>
          </div>
        </div>
      </div>
      <div className="airport-specifics-page">
        <div className="airport-specifics-head">Airport specifics</div>
        <div className="airport-specifics-view-data">
          <div className="airport-specifics-details-head"></div>
          <div className="airport-specifics-view-details-form">
                <form>
                    <label htmlFor="IATA Code">IATA Code: </label>
                    <input type="text" name="IATA Code" id="IATA Code" value={specificAirportIataCode} onChange={(e) => setSpecificAirportIataCode(e.target.value)} />
                    <div className="airport-specifics-view-button-container">
                        <button type="button" className="button" onClick={handleShowSpecificAirportDetails}>
                            Show details
                        </button>
                    </div>
                </form>
            </div>
            {addSpecificAirportResult && (
                <div className="airport-specifics-view-result" dangerouslySetInnerHTML={{ __html: addSpecificAirportResult }} />
            )}
            </div>
        </div>
        <div className="fare-page">
        <div className="fare-head">Fare Calculations</div>
        <div className="fare-view-data">
          <div className="fare-details-head"></div>
          <div className="fare-form">
                <form>
                    <label htmlFor="Flight Id">Flight Id: </label>
                    <input type="text" name="Flight Id" id="flight_id1" value={fareFlightId} onChange={(e) => setfareFlightId(e.target.value)} />
                    <br />
                    <label htmlFor="Departure">Departure: </label>
                    <input type="datetime" name="departure" id="departure1" value={faredeparture} onChange={(e) => setfaredeparture(e.target.value)} />
                    <div className="fare-view-button-container">
                        <button type="button" className="button" onClick={handlefarecalc}>
                            Show fares
                        </button>
                    </div>
                </form>
            </div>
            {addfareResult && (
                <div className="fare-view-result" dangerouslySetInnerHTML={{ __html: addfareResult }} />
            )}
            </div>
        </div>
    </div>
  );
}

export default MainPage;
