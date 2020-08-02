addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const createCookie = `
  const url = "https://cookie-monster.subhash.workers.dev/"
  console.log('Sending req ')
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ name, quote }),
    referrerPolicy: 'origin'
  }).then(res => console.log('res ', res))
  .catch(err => console.log('err ', err))
  console.log('Sent req ')
`

function handleOptions() {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  return new Response(null, {
    headers: corsHeaders
  })
}

async function handlePost(request) {
  const body = await request.json()
  const response = new Response('POST got '+JSON.stringify(body))
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}

function handleGet() {
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
  return handleGet()
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