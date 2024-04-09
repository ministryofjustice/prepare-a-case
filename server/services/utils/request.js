// A library for communicating with shared MoJ services using the oauth JWT token.

// used for get, delete
const fetchJSON = async (method, ServiceError, customHeaders, url, urlSearchParams) => {

  const fullURL = url + (urlSearchParams? urlSearchParams.toString() : '')
  try {
    var response = await fetch(fullURL, {
      method,
      headers: { ...jsonHeaders, ...customHeaders } 
    })
    if (!response.ok) {
      throw new Error("Response not ok!")
    }
    return {
      meta: response.headers,
      data: response.json()
    }
  } catch (e) {
    const error = new ServiceError(e.message, { url:fullURL, headers }, response)
    error.stack = e.stack
    throw error
  }
}

// used for post, put, patch
const sendJSON = async (method, ServiceError, customHeaders, url, json) => {

  try {
    var response = await fetch(url, {
      method,
      headers: { ...jsonHeaders, ...customHeaders },
      body: JSON.stringify(json)
    })
    if (!response.ok) {
      throw new Error("Response not ok!")
    }
    return {
      meta: response.headers,
      data: response.json()
    }
  } catch (e) {
    const error = new ServiceError(e.message, { url:fullURL, headers }, response)
    error.stack = e.stack
    throw error
  }
}

module.exports = ServiceError => {

  const headers = {
    Authorization: 'Bearer ' + token
  }
  const jsonHeaders = {
    ...headers,
    Accept: 'application/json'
  }

  return {
    getJSON: (customHeaders, url, urlSearchParams) => 
      fetchJSON('GET', ServiceError, { ...jsonHeaders, ...customHeaders }, url, urlSearchParams),
    deleteJSON: (customHeaders, url, urlSearchParams) => 
      fetchJSON('DELETE', ServiceError, { ...jsonHeaders, ...customHeaders }, url, urlSearchParams),
    putJSON: (customHeaders, url, json) => 
      sendJSON('PUT', ServiceError, { ...jsonHeaders, ...customHeaders }, url, json),
    postJSON: (customHeaders, url, json) => 
      sendJSON('POST', ServiceError, { ...jsonHeaders, ...customHeaders }, url, json),
    patchJSON: (customHeaders, url, json) => 
      sendJSON('PATCH', ServiceError, { ...jsonHeaders, ...customHeaders }, url, json)
  }
}