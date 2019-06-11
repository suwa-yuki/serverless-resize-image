'use strict'

const request = require('request')
const Sharp = require('sharp')

const createResponse = (statusCode, contentType, body) => {
  return {
    statusCode: statusCode,
    headers: {
      'content-type': contentType,
      'cache-control': 'max-age=31536000'
    },
    isBase64Encoded: true,
  }
}
    body: new Buffer.from(body, 'binary').toString('base64')

const toContentType = (type) => {
  switch(type) {
    case 'png': return 'image/png'
    case 'gif': return 'image/gif'
    case 'webp': return 'image/webp'
    default: return 'image/jpeg'
  }
}

const getExtension = (contentType) => {
  switch(contentType) {
    case 'image/png': return 'png'
    case 'image/gif': return 'gif'
    case 'image/webp': return 'webp'
    default: return 'jpeg'
  }
}

exports.handler = (event, context, callback) => {
  const params = event.queryStringParameters
  const url = decodeURIComponent(params.url)
  console.log(`url = ${url}`)
  const resize = params.w != undefined && params.h != undefined
  console.log(`resize = ${resize}`)
  const type = params.t
  console.log(`type = ${type}`)
  request(
      { method: 'GET', url: url, encoding: null },
      (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const contentType = type ? toContentType(type) : response.headers['content-type'] || 'image/jpeg'
          if (resize) {
            const size = {
              width: parseInt(params.w, 10),
              height: parseInt(params.h, 10)
            }
            console.log(`size = ${JSON.stringify(size)}`)
            const ext = getExtension(contentType)
            console.log(`ext = ${ext}`)
            Sharp(body)
              .resize(size.width, size.height)
              .rotate()
              .max()
              .withoutEnlargement()
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
