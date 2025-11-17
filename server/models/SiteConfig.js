const mongoose = require('mongoose');

const SiteConfigSchema = new mongoose.Schema({
  // Form Configuration
  formFields: [{
    name: String,
    label: String,
    type: {
      type: String,
      enum: ['text', 'email', 'tel', 'url', 'textarea', 'select', 'radio', 'checkbox', 'number', 'date']
    },
    placeholder: String,
    required: Boolean,
    options: [String], // For select, radio, checkbox
    order: Number,
    validation: {
      minLength: Number,
      maxLength: Number,
      pattern: String,
      min: Number,
      max: Number
    },
    description: String,
    warning: String,
    visible: { type: Boolean, default: true }
  }],

  // Bootcamp Schedule
  schedule: [{
    time: String,
    title: String,
    description: String,
    icon: String,
    color: String,
    order: Number,
    visible: { type: Boolean, default: true }
  }],

  // What You Will Learn (Curriculum)
  curriculum: [{
    title: String,
    icon: String,
    description: String,
    skills: [String],
    order: Number,
    color: String,
    visible: { type: Boolean, default: true }
  }],

  // Bootcamp Details
  bootcampDetails: [{
    icon: String,
    title: String,
    description: String,
    color: String,
    order: Number,
    visible: { type: Boolean, default: true }
  }],

  // Site Info
  siteInfo: {
    bootcampDate: Date,
    bootcampTitle: String,
    heroTitle: String,
    heroSubtitle: String,
    aboutDescription: String,
    registrationOpen: { type: Boolean, default: true },
    maxParticipants: { type: Number, default: 100 }
  },

  // Bonus Benefits
  bonusBenefits: [{
    icon: String,
    title: String,
    description: String,
    color: String,
    order: Number,
    visible: { type: Boolean, default: true }
  }],

  // Contact Info
  contactInfo: {
    email: String,
    location: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      discord: String
    }
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SiteConfig', SiteConfigSchema);
