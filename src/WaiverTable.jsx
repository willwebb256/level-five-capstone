// WaiverTable.jsx
import React, { useState } from 'react';
import moment from 'moment';
import './WaiverTable.css';

const WaiverTable = ({ waivers, searchQuery, onEditClick, onEditField, onSaveEdit, onCancelEdit, onDeleteWaiver }) => {
  const [editableField, setEditableField] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEditClick = (waiver) => {
    onEditClick(waiver);
    setEditableField(waiver._id);
    setEditedValues({
      firstName: waiver.firstName,
      lastName: waiver.lastName,
      dateOfBirth: waiver.dateOfBirth,
      email: waiver.email,
      signatureData: waiver.signatureData,
    });
  };

  const handleEditFieldChange = (fieldName, fieldValue) => {
    setEditedValues((prevValues) => ({
      ...prevValues,
      [fieldName]: fieldValue,
    }));
  };

  const handleSaveEdit = (waiverId) => {
    onSaveEdit(waiverId, editedValues);
    setEditableField(null);
    setEditedValues({});
  };

  const handleCancelEdit = () => {
    onCancelEdit();
    setEditableField(null);
    setEditedValues({});
  };

  const handleDeleteClick = (waiverId) => {
    onDeleteWaiver(waiverId);
  };

  const filteredWaivers = waivers.filter((waiver) =>
    waiver.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="waiver-table">
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Signature</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredWaivers.map((waiver) => (
            <tr key={waiver._id}>
              <td>
                {editableField === waiver._id ? (
                  <input
                    type="text"
                    value={editedValues.firstName || waiver.firstName}
                    onChange={(e) => handleEditFieldChange('firstName', e.target.value)}
                  />
                ) : (
                  waiver.firstName
                )}
              </td>
              <td>
                {editableField === waiver._id ? (
                  <input
                    type="text"
                    value={editedValues.lastName || waiver.lastName}
                    onChange={(e) => handleEditFieldChange('lastName', e.target.value)}
                  />
                ) : (
                  waiver.lastName
                )}
              </td>
              <td>
                {editableField === waiver._id ? (
                  <input
                    type="date"
                    value={editedValues.dateOfBirth || moment(waiver.dateOfBirth).format('YYYY-MM-DD')}
                    onChange={(e) => handleEditFieldChange('dateOfBirth', e.target.value)}
                  />
                ) : (
                  moment(waiver.dateOfBirth).format('YYYY-MM-DD')
                )}
              </td>
              <td>
                {editableField === waiver._id ? (
                  <input
                    type="email"
                    value={editedValues.email || waiver.email}
                    onChange={(e) => handleEditFieldChange('email', e.target.value)}
                  />
                ) : (
                  waiver.email
                )}
              </td>
              <td className="signature-column">
                {editableField === waiver._id ? (
                  <input
                    type="text"
                    value={editedValues.signatureData || waiver.signatureData}
                    onChange={(e) => handleEditFieldChange('signatureData', e.target.value)}
                  />
                ) : (
                  <div className="small-signature" style={{ backgroundImage: `url(${waiver.signatureData})` }} />
                )}
              </td>
              <td>
                {editableField === waiver._id ? (
                  <>
                    <button onClick={() => handleSaveEdit(waiver._id)} className="save-button">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-button">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(waiver)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(waiver._id)} className="delete-button">
                      Delete
                    </button>
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





