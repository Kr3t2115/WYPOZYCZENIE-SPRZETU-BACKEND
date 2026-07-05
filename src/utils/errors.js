class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

class ConflictError extends ApiError {
    constructor(message = 'Conflict') {
        super(message, 409)
    }
}

class NotFoundError extends ApiError {
    constructor(message = 'Not found') {
        super(message, 404)
    }
}

class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = 'Forbidden') {
        super(message, 401)
    }
}

class BadRequestError extends ApiError {
    constructor(message = 'Bad request') {
        super(message, 400)
    }
}

export {
    NotFoundError,
    ConflictError,
    ForbiddenError,
    BadRequestError,
    UnauthorizedError,
}
