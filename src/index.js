'use strict'

const request = require('request')
const Sharp = require('sharp')

const createResponse = (statusCode, contentType, body) => {
  return {
    statusCode: statusCode,
    headers: {
      "content-type" : contentType
    },
    isBase64Encoded: true,
    body: new Buffer(body).toString('base64')
  }
}

const getExtension = (contentType) => {
  switch(contentType) {
    case 'image/png': return 'png'
    case 'image/gif': return 'gif'
    default: return 'jpeg'
  }
}

exports.handler = (event, context, callback) => {
  const params = event.queryStringParameters
  const url = decodeURIComponent(params.url)
  console.log(`url = ${url}`)
  const resize = params.width != undefined && params.height != undefined
  console.log(`resize = ${resize}`)
  request(
      { method: 'GET', url: url, encoding: null },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          if (resize) {
            const size = {
              width: parseInt(params.width, 10),
              height: parseInt(params.height, 10)
            }
            console.log(`size = ${JSON.stringify(size)}`)
            const contentType = response.headers['content-type']
            const ext = getExtension(contentType)
            console.log(`ext = ${ext}`)
            Sharp(body)
              .resize(size.width, size.height)
              .max()
              .toFormat(ext)
              .toBuffer()
              .then(data => {
                callback(null, createResponse(200, contentType, data))
              })
          } else {
            callback(null, createResponse(200, contentType, body))
          }
        }
      }
  )
}
