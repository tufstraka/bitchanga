export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate Error',
      message: 'A resource with that identifier already exists'
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
};