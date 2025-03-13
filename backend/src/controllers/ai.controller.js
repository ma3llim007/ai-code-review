import generateContent from "../services/ai.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getReview = asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(400).json(new ApiError(400, "Code Is Required"));
    }

    const response = await generateContent(code);

    return res.send(response);
});

export { getReview };
