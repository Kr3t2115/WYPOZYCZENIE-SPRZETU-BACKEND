class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}

class ConflictError extends ApiError {
    constructor(message = 'Konflikt danych') {
        super(message, 409)
    }
}

class NotFoundError extends ApiError {
    constructor(message = 'Nie znaleziono') {
        super(message, 404)
    }
}

class ForbiddenError extends ApiError {
    constructor(message = 'Brak uprawnień') {
        super(message, 403)
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = 'Wymagane uwierzytelnienie') {
        super(message, 401)
    }
}

class BadRequestError extends ApiError {
    constructor(message = 'Nieprawidłowe żądanie') {
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
