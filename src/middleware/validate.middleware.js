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
            throw new BadRequestError()
        }

        const result = schema.safeParse(sourceData[source])

        if (!result.success) {
            const validationErrors = result.error.issues.reduce(
                (acc, issue) => {
                    const field = issue.path.join('.') || 'root'

                    if (!acc[field]) {
                        acc[field] = issue.message
                    }

                    return acc
                },
                {}
            )

            return res.status(400).json({ validationErrors })
        }

        req[source] = result.data

        next()
    }
}

export { validateMiddleware, VALIDATION_SOURCE }
