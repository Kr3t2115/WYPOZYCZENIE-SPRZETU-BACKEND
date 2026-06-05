const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body)

        if(!result) {
            const errorMessages = result.error.errors.map((err) => err.message);
            const error = errorMessages.join(", ");
            return res.status(400).json({error: error});
        }

        next();
    }
}

export {validate}