import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        "components": {
            "securitySchemes": {
                "BearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            }
        },
        info: {
            title: 'midigital Api Swagger',
            version: '1.0.0',
            description: 'A sample API descriptor',
            contact: {
                name: 'Mauro Iemboli',
                email: 'mauro@midigital.studio'
            },
            servers: [
                {
                    url: 'http://localhost:3000/api/v1'
                }
            ]
        },
    },
    apis: ['./src/routes/*.ts'], // files containing Swagger annotations
};

const specs = swaggerJsdoc(options);

export default specs;
