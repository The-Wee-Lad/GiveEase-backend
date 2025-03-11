import { cookieOptions } from "../constants.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"


const generateAccessAndRefreshToken = async(userid) => {
    try {
        const user = await User.findById(userid);   
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();        
        return { accessToken, refreshToken};

    } catch (error) {
        throw Error(`Couldn't Generate refereshToken and accessToken : ${error}`);
    }
};

const refreshAccessToken = asyncHandler( async(req, res) => {

    console.log("Refreshing The Token");
    try {
        const receivedRefreshToken = req.cookies.refreshToken || req.body.refreshToken ;
        let decodedRefreshToken;
        try {
            decodedRefreshToken = jwt.verify(receivedRefreshToken, process.env.REFRESH_TOKEN_SECRET);    
        } catch (error) {
            if(error.name == "TokenExpiredError"){
                res.status(401).json(new ApiResponse(401, {}, "Expired Refresh Token", 719));
                throw new Error("Expired Refresh Token [Refresh Access Token]");
            }
        }
        const userid = decodedRefreshToken?._id;
        const user = await User.findById(userid);
    
        if(!user){
            res.status(401).json(new ApiResponse(401, {}, "Invalid Refresh Token", 719));
            throw new Error("Invalid Refresh Token [Refresh Access Token]");
        }
    
        const storedRefreshToken = user?.refreshToken;
    
        if(storedRefreshToken !==  receivedRefreshToken){
            res.status(401).json(new ApiResponse(401, {}, "Invalid Refresh Token", 719));
            throw new Error("Refresh Token Expired [Refresh Access Token]");
        }
        
        let accessToken, refreshToken;
        try {
            ({accessToken, refreshToken} = await generateAccessAndRefreshToken(user?._id));
        } catch (error) {
            res.status(500).json(new ApiResponse(401, {}, "Couldn't Generate Tokens", 720));
            throw new Error("Couldn't generate Tokens");
        }        
        
        res
        .status(200)
        .cookie("accessToken",accessToken,cookieOptions)
        .cookie("refreshToken",refreshToken,cookieOptions)
        .json(new ApiResponse(200,{accessToken, refreshToken}, "new accessToken generated successfully"));
    } catch (error) {
        throw new Error(`couldn't refresh Access Token [Refresh Access Token] ${error}`);
    }
});

const loginUser = asyncHandler(async (req,res) => {
    const {usernameOrEmail, password} = req.body;
    
    if(!usernameOrEmail || !password){
        return res.status(400).json(new ApiResponse(400, {},"All Fields Required", 700));
    }

    const user = await User.findOne({
        $or : [
            {username:usernameOrEmail}
            ,{email:usernameOrEmail}
            ]
        });
    
    if(!user){
        return res.status(401).json(new ApiResponse(401, {},"Invalid Credentials", 707));
    }

    if(!await user.checkPassword(password)){
        return res.status(401).json(new ApiResponse(401, {},"Invalid Credentials", 707));
    }

    
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user?._id);
    const userObj = user.toObject(); 
    delete userObj.password;
    delete userObj.refreshToken;

    res
        .status(200)
        .cookie("accessToken",accessToken,cookieOptions)
        .cookie("refreshToken",refreshToken,cookieOptions)
        // .set("Cache-Control","no-store, no-cache, must-revalidate, private")
        .json(new ApiResponse(200,{user:userObj,accessToken, refreshToken}, "Successfully Logged In"));
});

const logoutUser = asyncHandler(async (req, res) => {
    const user_id = req.user?._id;
        // console.log(user_id);
        const user = await User.findByIdAndUpdate(user_id,{
            $unset:{refreshToken:""}
        });
        if(!user){
            res.status(500).json(new ApiResponse(500,{}, "Couldn't logout", 710));
            throw new Error("DB error on logout");
        }
        res.status(200)
        .clearCookie("refreshToken",cookieOptions)
        .clearCookie("accessToken",cookieOptions)  
        // .set("Cache-Control","no-store, no-cache, must-revalidate, private")
        .json(new ApiResponse(200,{},"Logged out Successfully"));
});

const registerUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body;
    // console.log(username,email,password);
    
    if(!username || !email || !password){
        return res.status(400).json(new ApiResponse(400, {},"All Fields Required", 700));
    }
    if(await User.findOne({username:username.toLowerCase()})){
        return res.status(409).json(new ApiResponse(400, {},"Username Already in Use", 701));
    }
    if(await User.findOne({email:email})){
        return res.status(409).json(new ApiResponse(400, {},"Email Already in use", 701));
    }

    const user =await User.create({
        username:username,
        email:email,
        password:password,
    });

    if(!user){
        res.status(500).json(new ApiResponse(500, {},"User Registration failed Server Error", 703));
    }
    res.status(200)
    // .set("Cache-Control","no-store, no-cache, must-revalidate, private")
    .json(new ApiResponse(200, {},"User Registered Successfully" ));
    }
);

const getCurrentUser = asyncHandler(async (req, res) => {
    if(!req?.user){
        res.status(500).json(new ApiResponse(500,{}, "Couldn't Fetch Cyrrent User", 702));
        throw new Error("Verification failed yet the data passed forward to getcurrentUser");
    }
    res.status(200).json(new ApiResponse(200, req?.user, "User Fetched!!", 200));
});


export {
    refreshAccessToken,
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
};