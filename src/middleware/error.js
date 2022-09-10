const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(error);

  if (err.name === "CastError")
    return new ErrorResponse("Resource not found", 404);

  if (err.code === 11000)
    return new ErrorResponse("Duplicate field value entered", 400);

  if (err.name === "ValidationError")
    return new ErrorResponse(
      Object.values(err.errors).map((val) => val.message),
      400
    );

  res.status(error.statusCode || 500).json({
    succsess: false,
    error: error.message || "Server error",
  });
};

module.exports = errorHandler;
