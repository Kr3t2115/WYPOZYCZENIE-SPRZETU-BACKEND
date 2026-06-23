import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Moje API',
            version: '1.0.0',
            description: 'Dokumentacja API',
        },
        servers: [
            {
                url: process.env.API_URL,
            },
        ],
    },
    apis: ['./src/docs/**/*.yaml'],
}

const swaggerSpec = swaggerJsdoc(options)

export { swaggerSpec }
