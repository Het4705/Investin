const mongoose = require('mongoose');

const partnership_schema = new mongoose.Schema({
    startupId: { type: mongoose.Schema.Types.ObjectId,
    ref: "startups"},
    investorId: { type: mongoose.Schema.Types.ObjectId,
    ref: "investor"},
    equity:{
        offered_percentage:{
            type:Number,
            required:true
        },
        amount:{
            type:Number,
            required:true
        }
    },
    date_of_agreement:{
          type:Date,
          required:true
    },
    company_agreed:{
        type:Boolean,
        default:false
    },
    startup_agreed:{
        type:Boolean,
        default:false
    }
});

const Partnership = mongoose.model('partnership',partnership_schema);

module.exports = Partnership;