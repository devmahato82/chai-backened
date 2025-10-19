import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError} from "../utils/ApiError.js";
import User from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontened
    //validation - not empty
    //check if user already exists : check username or email
    //check for images, check for avator
    //upload them to cloudinary
    // create user Object - create entry in DB
    //remove password and refrsh token field from response
    //check for user creation 
    // return response to frontend


    const {fullName, email, username, password } = req.body
    console.log("email :", email);

    // if (fullName === "" ){
    //     throw new ApiError(400, "fullName is required");
    // }

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists with this username or email")  
    }

    const avatorLocalPath = req.files?.avator[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatorLocalPath ){
        throw new ApiError (400, "Avator file is required")
    }

    const avator = await uploadOnCloudinary(avatorLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avator) {
        throw new ApiError(400, "Avator file is required")
    }

    const user = await User.create({
        fullName,
        avator: avator.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshTokens")

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }
    
})

return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully")
)



export {registerUser};