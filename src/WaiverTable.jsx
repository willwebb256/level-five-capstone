import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:9000'; // Replace with your backend server URL

const WaiverTable = ({ waivers, onNewWaiver }) => {
  const [selectedWaiver, setSelectedWaiver] = useState(null);
  const [editedSignatureData, setEditedSignatureData] = useState('');

  // Function to handle selecting a waiver for editing
  const handleEditWaiver = (waiver) => {
    setSelectedWaiver(waiver);
    setEditedSignatureData(waiver.signatureData);
  };

  // Function to handle saving the edited waiver
  const handleSaveEditedWaiver = async () => {
    try {
      if (selectedWaiver) {
        await axios.put(`${BASE_URL}/waivers/${selectedWaiver._id}`, {
          signatureData: editedSignatureData,
        });
        setSelectedWaiver(null); // Clear the selected waiver after saving
        onNewWaiver(); // Notify App component about the update
      }
    } catch (error) {
      console.error('Error saving edited waiver:', error);
    }
  };
  
    // Function to handle deleting a waiver
    const handleDeleteWaiver = async (waiverId) => {
      try {
        await axios.delete(`${BASE_URL}/waivers/${waiverId}`);
        // Notify App component about the deletion
        onNewWaiver('delete', { _id: waiverId });
      } catch (error) {
        console.error('Error deleting waiver:', error);
      }
    };
  

  return (
    <div className="waiver-table">
      <h2>Saved Waivers</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Adult</th>
            <th>Signature</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {waivers.map((waiver) => (
            <tr key={waiver._id}>
              <td>{waiver.firstName}</td>
              <td>{waiver.lastName}</td>
              <td>{waiver.isAdult ? 'Yes' : 'No'}</td>
              <td>
                {/* Display the signature image */}
                <img
                  src={waiver.signatureData}
                  alt="Signature"
                  style={{ width: '100px', height: 'auto' }}
                />
              </td>
              <td>{new Date(waiver.dateSigned).toLocaleString()}</td>
              <td>
                {/* Show edit and delete buttons when a waiver is selected */}
                {selectedWaiver && selectedWaiver._id === waiver._id ? (
                  <>
                    <button onClick={handleSaveEditedWaiver}>Save</button>
                    <button onClick={() => setSelectedWaiver(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditWaiver(waiver)}>Edit</button>
                    <button onClick={() => handleDeleteWaiver(waiver._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WaiverTable;
