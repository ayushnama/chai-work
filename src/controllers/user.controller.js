import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/User.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // if(fullName == ""){
  //   throw new ApiError(400, "fullname is required")
  // }
  if (
    [fullName, email, username, password].some((field) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "fullname is required");
  }
  const existedUser = user.findOne({
    $or: [{ username }, { password }],
  });
  if (existedUser) {
    throw new ApiError(409, "username or password already exist");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);

  if (!avatar) {
    throw new ApiError(400, "avatar is required");
  }

  const user = await User.Create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.lowerCase(),
  });

  const createdUSer = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUSer) {
    throw new ApiError(500, "something went wrong while registering user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createduser, "user registered successfully"));
});

export { registerUser };
