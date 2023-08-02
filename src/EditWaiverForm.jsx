import React, { useState } from 'react';
import SignaturePad from 'react-signature-canvas';

const EditWaiverForm = ({ selectedWaiver, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState(selectedWaiver.firstName);
  const [lastName, setLastName] = useState(selectedWaiver.lastName);
  const [isAdult, setIsAdult] = useState(selectedWaiver.isAdult);
  const [signaturePad, setSignaturePad] = useState(null);

  const handleClearSignature = () => {
    signaturePad.clear();
  };

  const handleSave = () => {
    const signatureData = signaturePad.toDataURL();
    const editedData = {
      firstName,
      lastName,
      isAdult,
      signatureData,
    };
    onSave(selectedWaiver._id, editedData);
  };

  return (
    <div className="edit-form-container">
      <h2>Edit Waiver</h2>
      <div className="form-container">
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <label htmlFor="isAdult">Adult:</label>
        <input type="checkbox" id="isAdult" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} />
      </div>
      <div className="signature-container">
        <SignaturePad ref={(ref) => setSignaturePad(ref)} canvasProps={{ className: 'signature-pad' }} />
        <div className="signature-buttons">
          <button onClick={handleClearSignature}>Clear</button>
        </div>
      </div>
      <div className="edit-form-buttons">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default EditWaiverForm;

