class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

class NotFoundError extends ApiError {
    constructor(message = 'Not found') {
        super(message, 404)
    }
}

class ConflictError extends ApiError {
    constructor(message = 'Conflict') {
        super(message, 409)
    }
}

class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

export { NotFoundError, ConflictError, ForbiddenError }
