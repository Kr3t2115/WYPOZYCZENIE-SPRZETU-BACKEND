const errorHandler = (err, req, res, next) => {
    const status = err.statusCode ?? 500
    const message = err.message ?? 'Wewnętrzny błąd serwera'
    return res.status(status).json({ message })
}

export { errorHandler }
