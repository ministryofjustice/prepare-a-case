// const SwaggerClient = require('swagger-client')
/*
 * This can be used to consume hosted swagger docs to ensure
 * it is always up to date
 */
const Validator = require('swagger-model-validator')
const swaggerSpec = require('./swagger_spec.json')
/* 
 * pulled from Swagger UI
 * if continued to use it would be useful to separate model into resources for human readability
 * this can easily be done by mapping validator.definitions
 */

const courtCase = require('../../mappings/cases/668911253.json')


describe('Validate Mocks', () => {
    let validator
    beforeAll(async () => {
        validator = new Validator(swaggerSpec)
    })

    it('validate test case', async () => {
        const responseBody = courtCase.response.jsonBody
        const courtCaseEntity = swaggerSpec.definitions.CourtCaseEntity
        const validation = validator.validate(responseBody, courtCaseEntity)

        expect(validation.errorCount).toBe(0)
    })
})