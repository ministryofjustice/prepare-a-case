const SwaggerClient = require('swagger-client')
const SwaggerDiff = require('swagger-diff')
const swaggerSpec = require('./swagger_spec.json')

describe.skip('Validate Swagger Spec', () => {

    it('swagger spec is the same', async () => {
        const liveSwaggerSpec = await new SwaggerClient('ADD URL')
        const validation = await SwaggerDiff(swaggerSpec, liveSwaggerSpec)

        expect(validation.errors).toHaveLength(0)
    })
})