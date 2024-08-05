const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
    
    companyName: { type: String, required: true },
    
    companyGovtVerifiedNo: { type: String, required: true,unique:true },
    
    admin_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    logo: { type: String },
    email: { type: String, required: true, unique: true },
    keyPeople: [{
        name: { type: String, required: true },
        position: { type: String },
        role: { type: String },
        info: { type: String },
        image:{type:String}
    }],
    companyInfo: { type: String },
    shareholderPattern: [{
        investor: { type: String, required: true },    // name of the investor firm
        holdingPercentage: { type: Number, required: true, min: 0, max: 100 } // Percentage of shares held
    }],
    domain: { type: String, required: true },
    clients: [{
        clientName: { type: String, required: true },
        work: { type: String },
        images: { type: [String] ,require:true},
        info: { type: String }
    }],
    interestedVC: [{
        investorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Investor"
        }
    }],
    pitch: { type: String },
    contact: { type: String, required: true },
    equityOffered: { type: Number, required: true, min: 0, max: 100 }, // Percentage of equity offered
    valuation:{
        type:Number,
        required:true,
    },
    website:{
        type:String
    },
    linkedIn:{
        type:String
    },
    stage:{
        type:String,
        enum: ["pre-seed", "seed","early","expansion"],
    },
    startupType:{
        type:String,
        enum:["product","service"]
    },
    // amount
    likes:{
        type:Number,
        default:0
    }

},{
    timestamps:true,
});

const Startup = mongoose.model('Startup', StartupSchema);

module.exports = Startup;
