// App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SignaturePad from 'react-signature-canvas';
import WaiverTable from './WaiverTable';
import companyLogo from './assets/axekpr.jpeg';
import WaiverPopup from './WaiverPopup';
import './App.css';

const BASE_URL = 'http://localhost:9000';

const App = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAdult, setIsAdult] = useState(true);
  const [signaturePad, setSignaturePad] = useState(null);
  const [signatureData, setSignatureData] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [electronicConsent, setElectronicConsent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClearSignature = () => {
    signaturePad.clear();
    setSignatureData('');
  };

  const handleNewWaiver = (action, data) => {
    if (action === 'delete') {
      setWaivers((prevWaivers) => prevWaivers.filter((waiver) => waiver._id !== data));
    } else {
      if (action === 'add') {
        setWaivers((prevWaivers) => [...prevWaivers, data]);
      } else if (action === 'update') {
        setWaivers((prevWaivers) =>
          prevWaivers.map((waiver) => (waiver._id === data._id ? data : waiver))
        );
      }
    }
  };

  const [waivers, setWaivers] = useState([]);

  const fetchWaivers = async (searchQuery = '') => {
    try {
      const response = await axios.get(`${BASE_URL}/waivers`, {
        params: { searchQuery },
      });
      setWaivers(response.data);
    } catch (error) {
      console.error('Error fetching waivers:', error);
    }
  };

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
          phoneNumber,
          dateOfBirth,
          email,
          zipCode,
          electronicConsent,
        });

        if (response.status === 201) {
          console.log('Waiver saved successfully!');
          setFirstName('');
          setLastName('');
          setIsAdult(true);
          setPhoneNumber('');
          setDateOfBirth('');
          setEmail('');
          setZipCode('');
          setElectronicConsent(false);
          handleClearSignature();
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

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleSearch = () => {
    fetchWaivers(searchQuery);
  };

  const handleEditWaiver = async (waiverId, editedData) => {
    try {
      const response = await axios.put(`${BASE_URL}/waivers/${waiverId}`, editedData);

      if (response.status === 200) {
        console.log('Waiver edited successfully!');
        fetchWaivers();
      } else {
        console.error('Error editing waiver. Status:', response.status);
      }
    } catch (error) {
      console.error('Error editing waiver:', error);
    }
  };

  const [selectedWaiver, setSelectedWaiver] = useState(null);

  const handleEditClick = (waiver) => {
    setSelectedWaiver(waiver);
  };

  const handleEditFieldChange = (fieldName, fieldValue) => {
    setSelectedWaiver((prevSelectedWaiver) => ({
      ...prevSelectedWaiver,
      [fieldName]: fieldValue,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      await handleEditWaiver(selectedWaiver._id, selectedWaiver);
      setSelectedWaiver(null); // Clear the selected waiver after saving
    } catch (error) {
      console.error('Error saving edited waiver:', error);
    }
  };

  const handleCancelEdit = () => {
    setSelectedWaiver(null); // Clear the selected waiver without saving changes
  };

  const handleDeleteWaiver = async (waiverId) => {
    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/waivers/${waiverId}`);
      onNewWaiver('delete', waiverId);
    } catch (error) {
      console.error('Error deleting waiver:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {showPopup && <WaiverPopup onClose={handlePopupClose} />}
      <img src={companyLogo} alt="Company Logo" />
      <h1>Waiver Form</h1>
      <div className="form-container">
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <label htmlFor="isAdult">Adult:</label>
        <input type="checkbox" id="isAdult" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} />
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        <label htmlFor="email">Email Address:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="zipCode">Zip code:</label>
        <input type="text" id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
      </div>

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
        <SignaturePad ref={(ref) => setSignaturePad(ref)} canvasProps={{ className: 'signature-pad' }} />
        <div className="signature-buttons">
          <button onClick={handleClearSignature}>Clear</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by first name, last name, or date signed"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="table-container">
        <WaiverTable
          waivers={waivers}
          searchQuery={searchQuery}
          onNewWaiver={handleNewWaiver}
          onEditClick={handleEditClick}
          onEditFieldChange={handleEditFieldChange}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onDeleteWaiver={handleDeleteWaiver}
        />
      </div>
    </div>
  );
};

export default App;


