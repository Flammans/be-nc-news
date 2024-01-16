class AppError extends Error {
  constructor(message) {
    super(message);

    this.name = "";
    this.code = 0;
  }
}

class BadRequestError extends AppError {
  constructor(message) {
    super(message || 'Bad Request');

    this.name = "BadRequestError";
    this.code = 400;
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Not Found');

    this.name = "NotFoundError";
    this.code = 404;
  }
}

class MethodNotAllowedError extends AppError {
  constructor(message) {
    super(message || 'Method Not Allowed');

    this.name = "MethodNotAllowedError";
    this.code = 405;
  }
}

class TeapotError extends AppError {
  constructor(message) {
    super(message || 'I\'m a teapot');

    this.name = "TeapotError";
    this.code = 418;
  }
}

class UnprocessableEntityError extends AppError {
  constructor(message) {
    super(message || 'Unprocessable Entity');

    this.name = "UnprocessableEntityError";
    this.code = 422;
  }
}

class InternalServerError extends AppError {
  constructor(message) {
    super(message || 'Internal Server Error');

    this.name = "InternalServerError";
    this.code = 500;
  }
}

module.exports = {
  AppError,
  BadRequestError,
  NotFoundError,
  MethodNotAllowedError,
  TeapotError,
  UnprocessableEntityError,
  InternalServerError
}