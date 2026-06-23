const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const sourceData = {
            params: req.params,
            query: req.query,
            body: req.body,
        }

        const result = schema.safeParse(sourceData[source])

        if (!result.success) {
            const errorMessages = result.error.issues.map((err) => err.message)
            const error = errorMessages.join(', ')
            return res.status(400).json({ error: error })
        }

        next()
    }
}

export { validate }
