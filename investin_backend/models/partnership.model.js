const mongoose = require('mongoose');

const partnershipSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'startups',
    required: true,
  },
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'investor',
    required: true,
  },
  equity: {
    offered_percentage: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  date_of_agreement: {
    type: Date,
    required: true,
  },
  company_agreed: {
    type: Boolean,
    default: false,
  },
  startup_agreed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'rejected', 'accepted'],
    default: 'pending',
  },
});

const Partnership = mongoose.model('Partnership', partnershipSchema);

module.exports = Partnership;
