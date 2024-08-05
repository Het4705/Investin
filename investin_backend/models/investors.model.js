const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({

    admin_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
   
    companyName: { type: String, required: true },
    
    companyGovtVerifiedNo: { type: String, required: true,unique:true },
    logo: { type: String },
   
    keyPeople: [{
        name: { type: String, required: true },
        position: { type: String },
        info: { type: String },
        image:{type:String}
    }],
    
    companiesInvested: [{
        cname: { type: String},
        clogo: { type: [String] },
        info: { type: String },
        holdingShare: { type: Number }
    }],

    briefInfo: { type: String },
    images:[{type:String}],
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    website:{
        type:String
    },
    linkedIn:{
        type:String
    },
    address: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    
    likes:{
         type:Number,
         default:0
    }
},{
    timestamps:true
});

const Investor = mongoose.model('Investor', InvestorSchema);

module.exports = Investor;
