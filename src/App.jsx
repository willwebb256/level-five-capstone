import React, { useState, useEffect } from 'react';
import axios from 'axios';

import SignaturePad from 'react-signature-canvas';
import WaiverTable from './WaiverTable'; // Import the WaiverTable component

import './App.css';
import companyLogo from './assets/axekpr.jpeg'; // Adjust the path to the image file
import WaiverPopup from './WaiverPopup'; // Import the WaiverPopup component

const BASE_URL = 'http://localhost:9000'; // Replace with your backend server URL

const App = () => {
  const [showPopup, setShowPopup] = useState(true);
  // Existing state variables
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAdult, setIsAdult] = useState(true);
  const [signaturePad, setSignaturePad] = useState(null);
  const [signatureData, setSignatureData] = useState('');

  // New state variables for the additional fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [electronicConsent, setElectronicConsent] = useState(false);

  const handleClearSignature = () => {
    signaturePad.clear();
    setSignatureData(''); // Clear the signature data
  };

  // Define the handleNewWaiver function to handle new waivers
  const handleNewWaiver = (action, data) => {
    if (action === 'delete') {
      // Remove the deleted waiver from the waivers state
      setWaivers((prevWaivers) => prevWaivers.filter((waiver) => waiver._id !== data));
    } else {
      // For other actions (add or update), handle the waiver data accordingly
      if (action === 'add') {
        // Add the new waiver to the waivers state
        setWaivers((prevWaivers) => [...prevWaivers, data]);
      } else if (action === 'update') {
        // Update the existing waiver in the waivers state
        setWaivers((prevWaivers) =>
          prevWaivers.map((waiver) => (waiver._id === data._id ? data : waiver))
        );
      }
    }
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
            phoneNumber,      // Add new fields to the request
            dateOfBirth,      // Add new fields to the request
            email,            // Add new fields to the request
            zipCode,          // Add new fields to the request
            electronicConsent // Add new fields to the request
          });
  
          if (response.status === 201) {
            console.log('Waiver saved successfully!');
            // Reset the form after successful save
            setFirstName('');
            setLastName('');
            setIsAdult(true);
            setPhoneNumber('');      // Reset the new fields
            setDateOfBirth('');      // Reset the new fields
            setEmail('');            // Reset the new fields
            setZipCode('');          // Reset the new fields
            setElectronicConsent(false); // Reset the new fields
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
    }

    const handlePopupClose = () => {
      setShowPopup(false);
    };

    return (
      <div className="app-container">
        {/* Show the waiver popup if showPopup is true */}
      {showPopup && <WaiverPopup onClose={handlePopupClose} />}
        {/* Display the company logo */}
        <img src={companyLogo} alt="Company Logo" />
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
  
          {/* New fields */}
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
  
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
  
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <label htmlFor="zipCode">Zip code:</label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
  
          <div className="consent-container">
            <label htmlFor="electronicConsent">Electronic Consent:</label>
            <input
              type="checkbox"
              id="electronicConsent"
              checked={electronicConsent}
              onChange={(e) => setElectronicConsent(e.target.checked)}
            />
          </div>
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






