addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const createCookie = `
  const url = "https://cookie-monster.subhash.workers.dev/"
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ name, quote }),
    credentials: 'include'
  }).then(res => console.log('Visitior IP ', res))
  .catch(err => console.log('err ', err))
`

const logCookie = (cookieStr) => {
  const cookies = cookieStr.split(';').map(c => {
    const [key, value] = c.split('=')
    return { key: key.trim(), value }
  })
  return `
    const cookies = ${JSON.stringify(cookies)}
    console.log("cookies - ", cookies)
    cookies.map(c => {
      document.cookie = "local_" + c.key + "=" + c.value + ";" 
    })
  `
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:4000',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Set-Cookie',
  'Access-Control-Allow-Credentials': 'true'
}

function handleOptions() {
  return new Response(null, {
    headers: corsHeaders
  })
}

async function handlePost(request) {
  const clientIP = request.headers.get('CF-Connecting-IP')
  const body = await request.json()
  const { name, quote } = body
  const attrs = 
    "Domain=cookie-monster.subhash.workers.dev; "+ 
    "path=/; "+
    `Max-Age=${Number.MAX_SAFE_INTEGER}; `+
    "SameSite=None; Secure"
  const cookieHeaders = {
    'Set-Cookie': [
      `name=foo`, 
      `quote=doo`]
  }
  const response = new Response(`${attrs}`, { 
    headers: corsHeaders
  })
  response.headers.append('Set-Cookie', `name=${name}; ${attrs}`)
  response.headers.append('Set-Cookie', `quote=${quote}; ${attrs}`)
  return response
}

function handleGet(request) {
  const cookieString = request.headers.get('Cookie')
  if (cookieString && cookieString.length) {
    return new Response(logCookie(cookieString))
  }
  return new Response(createCookie, {
    headers: { 'content-type': 'text/plain' },
  })
}

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return handleOptions()
  }
  if (request.method === 'POST') {
    return handlePost(request)
  }
  return handleGet(request)
}

function getCookie(request, name) {
  let result = ''
  const cookieString = request.headers.get('Cookie')
  if (cookieString) {
    const cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        const cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}