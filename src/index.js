'use strict'

const request = require('request');

const createResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    isBase64Encoded: true,
    body: new Buffer(body).toString('base64')
  }
}

exports.handler = (event, context, callback) => {
  const params = event.queryStringParameters
  const url = decodeURIComponent(params.url)
  console.log(`url = ${url}`)
  const size = {
    width: params.max_width,
    height: params.max_height
  }
  request(
      { method: 'GET', url: url, encoding: null },
      (error, response, body) => {
          if (!error && response.statusCode === 200) {
            callback(null, createResponse(200, body))
          }
      }
  )
}
