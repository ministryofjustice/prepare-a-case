const axios = require('axios')
const { settings: { defaultTimeout } } = require('../../../config')

const request = async url => {
  return await axios.get(url, { headers: { Accept: 'application/json' }, timeout: defaultTimeout })
}

const requestFile = async url => await axios.get(url, { responseType: 'stream', timeout: defaultTimeout })

const update = async (url, data) => await axios.put(url, data, { headers: { Accept: 'application/json' }, timeout: defaultTimeout })

const create = async (url, data) => await axios.post(url, data, { headers: { Accept: 'application/json' }, timeout: defaultTimeout })

const httpDelete = async (url) => await axios.delete(url, { headers: { Accept: 'application/json' }, timeout: defaultTimeout })

module.exports = {
  request,
  requestFile,
  update,
  httpDelete,
  create
}
