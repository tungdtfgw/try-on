export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : message,
    },
  };

  // Log error for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
