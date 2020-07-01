const SwaggerClient = require('swagger-client')
const Validator = require('swagger-model-validator')

async function getValidator () {
  const swaggerUrl = process.env.COURT_CASE_SERVICE_URL || 'http://localhost:8080'
  let response
  try {
    response = await new SwaggerClient(`${swaggerUrl}/v2/api-docs`)
  } catch {
    throw new Error('Error fetching Swagger docs from ' + swaggerUrl)
  }
  return new Validator(response.spec)
}

function validate (validator, target, swaggerModel) {
  const validation = validator.validate(target, swaggerModel, false, true)

  if (!validation.valid) {
    const errors = validation.GetFormattedErrors()
    console.warn(errors.map(($item, $index) => {
      return `Error ${$index + 1}: ${$item.message}`
    }).join('\n'))
  }

  return validation.valid
}

module.exports = {
  validate,
  getValidator
}
