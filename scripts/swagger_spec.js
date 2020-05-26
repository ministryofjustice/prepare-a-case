#!/usr/bin/env node
const fs = require('fs')
const SwaggerClient = require('swagger-client')
const SwaggerDiff = require('swagger-diff')
const swaggerSpec = require('./tests/swagger_spec.json')

(async() => {
    try {
        //NB: You must be connected to VPN to access swagger spec
        const liveSwaggerSpec = await new SwaggerClient('ADD URL')
        const validation = await SwaggerDiff(swaggerSpec, liveSwaggerSpec)
    
        if (validation.errors.length !== 0){
            console.log('Swagger spec is out of date 😨')

            fs.writeFileSync('./tests/swagger_spec.json', liveSwaggerSpec)

            console.log('Swagger spec has been updated ✨')
        } else {
            console.log('Swagger spec is up to date ✨')
        }
        
    } catch (error) {
        console.log('There has been an error!')
        console.log(error);
    }
})()