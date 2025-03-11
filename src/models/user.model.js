import mongoose,{ Schema,model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const contactSchema = new Schema({
    phone: {
        type: String,
        validate: {
            validator: function (phone) {
                return phone.length === 10 || phone.length === 0;
            },
            message: "Phone number needs to be 10 digits long",
        },
    },
    address1:{
        type:String
    },
    address2:{
        type:String
    },
    address3:{
        type:String
    }
});

const userSchema = new Schema({
    fullname:{
        type:String
    },
    email:{
        type:String,
        required: [true,"Email is required"]
    },
    username:{
        type:String,
        required: [true, "Username is Required"]
    },
    password:{
        type:String,
        required: [true, "Passwrod is Required"]
    },
    contact:{
        type: contactSchema
    },
    donationHistory: [{
        type: mongoose.Types.ObjectId, 
        ref: "donations"
    }]
},{timestamps: true});


userSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 13);
    next();
});

userSchema.methods.generateAccessToken = function (){
    const payload = {
        fullname : this.fullname,
        email : this.email,
        username : this.username,
        _id : this._id
    };
    const JWT = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.exp.ACCESS_TOKEN_EXPIRY});
    return JWT;
}

userSchema.methods.generateRefreshToken = function (){
    const payload = {
        _id : this._id
    };
    const JWT = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.exp.REFRESH_TOKEN_EXPIRY});
    return JWT;
}

export const User = model("users",userSchema);