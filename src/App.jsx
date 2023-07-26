import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SignaturePad from 'react-signature-canvas';
import WaiverTable from './WaiverTable'; // Import the WaiverTable component

import './App.css';

const BASE_URL = 'http://localhost:9000'; // Replace with your backend server URL

const App = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAdult, setIsAdult] = useState(true);
  const [signaturePad, setSignaturePad] = useState(null);
  const [signatureData, setSignatureData] = useState('');

  const handleClearSignature = () => {
    signaturePad.clear();
    setSignatureData(''); // Clear the signature data
  };

    // State to hold the data for the table
    const [waivers, setWaivers] = useState([]);

    // Function to fetch the waiver data from the server
    const fetchWaivers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/waivers`);
        setWaivers(response.data);
      } catch (error) {
        console.error('Error fetching waivers:', error);
      }
    };
  
    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
      fetchWaivers();
    }, []);

    const handleSave = async () => {
      if (!signaturePad.isEmpty()) {
        const signatureData = signaturePad.toDataURL();
        try {
          const response = await axios.post(`${BASE_URL}/waivers`, {
            firstName,
            lastName,
            isAdult,
            signatureData,
          });
    
          if (response.status === 201) {
            console.log('Waiver saved successfully!');
            // Reset the form after successful save
            setFirstName('');
            setLastName('');
            setIsAdult(true);
            handleClearSignature();
    
          // Fetch the updated data after successful form submission
          fetchWaivers();
        } else {
          console.error('Error saving waiver. Status:', response.status);
        }
      } catch (error) {
        console.error('Error saving waiver:', error);
      }
    } else {
      alert('Please sign the waiver.');
    }
  };

  // Function to handle new waiver submission or deletion and update WaiverTable
  const handleNewWaiver = (action, updatedWaiver) => {
    if (action === 'add') {
      // Add the new waiver to the existing waivers
      setWaivers([...waivers, updatedWaiver]);
    } else if (action === 'delete') {
      // Filter out the deleted waiver from the existing waivers
      setWaivers(waivers.filter((waiver) => waiver._id !== updatedWaiver._id));
    }
  };
  

  return (
    <div className="app-container">
      <h1>Waiver Form</h1>
      <div className="form-container">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label htmlFor="isAdult">Adult:</label>
        <input
          type="checkbox"
          id="isAdult"
          checked={isAdult}
          onChange={(e) => setIsAdult(e.target.checked)}
        />
        <div className="signature-container">
          <SignaturePad
            ref={(ref) => setSignaturePad(ref)}
            canvasProps={{ className: 'signature-pad' }}
          />
          <div className="signature-buttons">
            <button onClick={handleClearSignature}>Clear</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
        </div>
        <div className="table-container">
        <WaiverTable waivers={waivers} onNewWaiver={handleNewWaiver} />
      </div>
    </div>

  );
};

export default App;






