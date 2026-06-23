const validate = (schema, source='body') => {
    return (req, res, next) => {
        const data = source === "params" ? req.params
            : source === "query"  ? req.query
                : req.body;

        const result = schema.safeParse(data);

        if(!result.success) {
            const errorMessages = result.error.errors.map((err) => err.message);
            const error = errorMessages.join(", ");
            return res.status(400).json({error: error});
        }

        next();
    }
}

export {validate}