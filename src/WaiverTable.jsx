import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:9000'; // Replace with your backend server URL

const WaiverTable = ({ waivers, onNewWaiver }) => {
  const [selectedWaiver, setSelectedWaiver] = useState(null);
  const [editedSignatureData, setEditedSignatureData] = useState('');
  const [loading, setLoading] = useState(false); // State for loading status

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
    setLoading(true); // Set loading state to true when delete operation starts
    try {
      await axios.delete(`${BASE_URL}/waivers/${waiverId}`);
      // Notify App component about the deletion
      onNewWaiver('delete', waiverId); // Pass the entire waiver object instead of just the ID
    } catch (error) {
      console.error('Error deleting waiver:', error);
    } finally {
      setLoading(false); // Reset loading state to false after delete operation completes
    }
  };

  return (
    <>
      <div className="waiver-table">
        <h2>Saved Waivers</h2>
        {loading ? (
          <div>Loading...</div> // Show loading state while deleting
        ) : (
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Adult</th>
                <th>Phone Number</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Zip Code</th>
                <th>Electronic Consent</th>
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
                  <td>{waiver.phoneNumber}</td>
                  <td>
                    {/* Display only the day, month, and year for Date of Birth */}
                    {new Date(waiver.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td>{waiver.email}</td>
                  <td>{waiver.zipCode}</td>
                  <td>{waiver.electronicConsent ? 'Yes' : 'No'}</td>
                  <td className="small-signature">
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
        )}
      </div>
    </>
  );
};

export default WaiverTable;
