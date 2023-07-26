// routes/waiverRouter.js
const express = require('express');
const router = express.Router();
const Waiver = require('../src/waiver');

// Save a new waiver
router.post('/', async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth,
        signatureData,
        email,
        zipCode,
        electronicConsent,
      } = req.body;
  
      const newWaiver = await Waiver.create({
        firstName,
        lastName,
        phoneNumber,
        dateOfBirth,
        signatureData,
        email,
        zipCode,
        electronicConsent,
      });
  
      res.status(201).json(newWaiver);
    } catch (error) {
      res.status(500).json({ error: 'Unable to save waiver.' });
    }
  });
  

// Search waivers by first name, last name, or date
router.get('/', async (req, res) => {
  try {
    const { firstName, lastName, dateSigned } = req.query;
    const query = {};
    if (firstName) query.firstName = firstName;
    if (lastName) query.lastName = lastName;
    if (dateSigned) query.dateSigned = { $gte: new Date(dateSigned) };
    const waivers = await Waiver.find(query);
    res.json(waivers);
  } catch (error) {
    res.status(500).json({ error: 'Unable to search waivers.' });
  }
});

// Update a waiver by ID (before signing)
router.put('/:id', async (req, res) => {
  try {
    const { signatureData } = req.body;
    const updatedWaiver = await Waiver.findByIdAndUpdate(
      req.params.id,
      { signatureData },
      { new: true }
    );
    if (!updatedWaiver) {
      return res.status(404).json({ error: 'Waiver not found.' });
    }
    res.json(updatedWaiver);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update waiver.' });
  }
});

// Delete a waiver by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedWaiver = await Waiver.findByIdAndDelete(req.params.id);
    if (!deletedWaiver) {
      return res.status(404).json({ error: 'Waiver not found.' });
    }
    res.json({ message: 'Waiver deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete waiver.' });
  }
});
// Get a waiver by ID
router.get('/:id', async (req, res) => {
    try {
      const waiverId = req.params.id;
      const waiver = await Waiver.findById(waiverId);
      if (!waiver) {
        return res.status(404).json({ error: 'Waiver not found.' });
      }
      res.json(waiver);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch waiver.' });
    }
  });
  
  // Update a waiver by ID (with additional fields)
  router.put('/:id', async (req, res) => {
    try {
      const waiverId = req.params.id;
      const {
        phoneNumber,
        dateOfBirth,
        email,
        zipCode,
        electronicConsent,
      } = req.body;
  
      const updatedWaiver = await Waiver.findByIdAndUpdate(
        waiverId,
        {
          phoneNumber,
          dateOfBirth,
          email,
          zipCode,
          electronicConsent,
        },
        { new: true }
      );
  
      if (!updatedWaiver) {
        return res.status(404).json({ error: 'Waiver not found.' });
      }
  
      res.json(updatedWaiver);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update waiver.' });
    }
  });
  
  module.exports = router;

