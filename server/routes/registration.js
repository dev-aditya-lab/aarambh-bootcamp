const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const SiteConfig = require('../models/SiteConfig');
const { verifyAdmin } = require('./admin');
const { sendRegistrationEmail } = require('../utils/emailService');

// POST - Create new registration
router.post('/', async (req, res) => {
  try {
    const registrationData = req.body;

    // Get form fields configuration for validation
    const config = await SiteConfig.findOne();
    const formFields = config?.formFields || [];

    // Validate based on form configuration
    const validationErrors = await Registration.validateRegistration(registrationData, formFields);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    // Check if email already exists
    if (registrationData.email) {
      const existingRegistration = await Registration.findOne({ email: registrationData.email });
      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          message: 'This email is already registered! 📧'
        });
      }
    }

    // Create new registration
    const registration = new Registration(registrationData);
    await registration.save();

    // Send confirmation email to participant only (async, don't wait)
    sendRegistrationEmail(registration.toObject()).catch(err => {
      console.error('Failed to send confirmation email:', err);
    });

    // Note: Admin notification removed - only sending to participant

    res.status(201).json({
      success: true,
      message: 'Registration successful! 🎉 Check your email for confirmation.',
      data: registration.getPublicProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered!'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.'
    });
  }
});

// GET - Get all registrations (with pagination and filters)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.experience) {
      filter.experience = req.query.experience;
    }
    if (req.query.year) {
      filter.year = req.query.year;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get registrations
    const registrations = await Registration.find(filter)
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Registration.countDocuments(filter);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
});

// GET - Get registration by ID
router.get('/:id', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).select('-__v');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration'
    });
  }
});

// GET - Get registration statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Registration.getStats();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// PUT - Update registration status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: registration
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
});

// DELETE - Delete registration (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete registration'
    });
  }
});

module.exports = router;
