import mongoose,{ Schema,model } from "mongoose";

const contactSchema = new Schema({
    phone: {
        type: String,
        validate: {
            validator: function (phone) {
                return phone.length === 10 || phone.length === 0 || phone === null;
            },
            message: "Phone number needs to be 10 digits long",
        },
        required:true
    },
    email:{
        type:String,
        required:true
    },
    address1:String,
    address2:String,
    address3:String
});

const ngoSchema = new Schema({
    name:{
        type:String,
        required:[true,"NGO needs a Name"]
    },
    description:{
        type:String,
        required:[true,"NGO needs a Description"]
    },
    cause:[String],
    certificate:String,
    verified:{
        type:Boolean,
        default:false
    },
    contact:{
        type:contactSchema,
        required:[true,"need email and phone number"]
    },
    donationNeed:{
        type: [String],
        enum:["financial","clothes","stationary","volunteers","tools"]
    },
    bankingDetails: {
        type: new Schema({
            accountHolderName: { type: String, required: true },
            accountNumber: { type: String, required: true },
            ifscCode: { type: String, required: true },
            bankName: { type: String, required: true },
            upiId: { type: String }
        }),
        required: true 
    }
},{timestamps:true});

export const Ngo = model("ngos",ngoSchema); 