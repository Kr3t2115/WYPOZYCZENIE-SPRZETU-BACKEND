import { BadRequestError } from '../utils/errors.util.js'

const VALIDATION_SOURCE = Object.freeze({
    BODY: 'body',
    QUERY: 'query',
    PARAMS: 'params',
})

const validateMiddleware = (schema, source = VALIDATION_SOURCE.BODY) => {
    return (req, res, next) => {
        const sourceData = {
            params: req.params,
            query: req.query,
            body: req.body,
        }

        if (!Object.values(VALIDATION_SOURCE).includes(source)) {
            throw new BadRequestError(`Bad request`)
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

export { validateMiddleware, VALIDATION_SOURCE }
