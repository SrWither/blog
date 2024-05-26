import axios, { type AxiosResponse } from 'axios'

export const getCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const authURL = import.meta.env.VITE_DSURL
    const popup = window.open(authURL, 'Discord OAuth Login', 'width=600,height=600')
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      reject('Por favor, desbloquea las ventanas emergentes para continuar.')
    }

    // Escuchar los cambios en la URL de la ventana emergente
    const interval = setInterval(() => {
      try {
        if (popup) {
          if (popup.location.href.indexOf(import.meta.env.VITE_REDIRECTURI) !== -1) {
            clearInterval(interval)
            const urlParams = new URLSearchParams(popup.location.search)
            const code = urlParams.get('code')
            if (code) {
              popup.close()
              resolve(code)
            } else {
              reject('No se pudo obtener el código de autorización.')
            }
          }
        }
      } catch (error) {
        console.log('Esperando por el código...')
      }
    }, 1000)
  })
}

export const exchangeCodeForToken = async (code: string): Promise<string> => {
  try {
    const response: AxiosResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: import.meta.env.VITE_DSID,
        client_secret: import.meta.env.VITE_DSSECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: import.meta.env.VITE_REDIRECTURI,
        scope: 'identify email'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    console.log(response.data)
    return response.data.access_token
  } catch (error) {
    console.error('Error al intercambiar el código por un token:', error)
    throw new Error('No se pudo obtener el token de acceso.')
  }
}

export const getUserData = async (accessToken: string): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error)
    throw new Error('No se pudo obtener los datos del usuario.')
  }
}
