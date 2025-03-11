import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";

// SubCode Meaning =>
// 715 : matlab login karna padega. kisi wajah se cookies cleared hai
// 716 : token decode nahi hua probably corrupt, Login karwao.
// 717 : token mein jo data hai outdated hai, Login karwao.
// 718 : Refresh endpoint hit Karna
// 719 : Refresh Expiry Error Occurred. Login Again
// 720 : Token Generation Error. servor error 

//700 : Form Validation Error of Somekind
//701 : Conflict with existing data username or email
//702 : Couldn't fetch current User. Login Again.
//703 : Failed At creating User 500 server error
//707 : Invalid credentials
//710 : Logout Failed Due to Mongo DB error

const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const receivedAccessToken = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer", "")?.trim();

        if (!receivedAccessToken) {
            res.json(new ApiResponse(401, {}, "Unauthorised Access",715));
            throw new ApiError(401, "Unauthorised Access");
        }

        let decodedAccessToken;
        try {
            decodedAccessToken = jwt.verify(receivedAccessToken, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            if (error.name == "TokenExpiredError") {
                res.status(401).json(new ApiResponse(401, {}, "Expired Access Token", 718));
                throw new Error("Expired Access Token [Refresh Access Token]");
            } else {
                res.status(401).json(new ApiResponse(401, {}, "Invalid Access Token",716));
                throw new Error("Invalid Access Token");
            }
        }

        const user = await User.findById(decodedAccessToken?._id);
        if (!user) {
            res.json(new ApiResponse(401, {}, "Invalid Access Token or Server MongoDB Error",717));
            throw new ApiError(401, "Invalid Access Token or MongoDB server Error");
        }
        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, `JWT Access Token could not be verified : ${error.name} : ${error.message}`);
    }
})

export { verifyJwt };