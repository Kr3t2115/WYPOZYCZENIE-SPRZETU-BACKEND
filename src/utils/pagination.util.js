const getPaginationParams = (page, limit) => {
    const parsedPage = Number(page) > 0 ? Number(page) : 1
    const parsedLimit = Number(limit) > 0 ? Number(limit) : 10

    const skip = (parsedPage - 1) * parsedLimit
    const take = parsedLimit

    return { page: parsedPage, limit: parsedLimit, skip, take }
}

const getPaginationMeta = (total, { page, limit }) => {
    const totalPages = Math.ceil(total / limit)

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    }
}

export { getPaginationParams, getPaginationMeta }
