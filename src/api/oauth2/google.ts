import axios from 'axios'
import { googleSdkLoaded } from 'vue3-google-login'

/**
 * Initiates Google authentication process using the Google SDK.
 *
 * @param {Function} callback The callback function to execute after authentication.
 * @param {string} [provider] Optional provider information.
 * @returns {void}
 */
export const googleAuth = (callback: Function, provider?: string): void => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initCodeClient({
        client_id: import.meta.env.VITE_CLIENTID, // Client ID obtained from environment variables
        scope: 'email profile openid', // Scope for required access
        redirect_uri: import.meta.env.VITE_REDIRECTURI, // Redirect URI obtained from environment variables
        callback: async (response: any) => {
          if (response.code) {
            const res = await sendCodeToBackend(response.code)
            if (provider) {
              await callback(res, provider)
            } else {
              await callback(res)
            }
          }
        }
      })
      .requestCode()
  })
}

/**
 * Sends the authorization code to the backend and retrieves user information.
 *
 * @param {any} code The authorization code obtained from Google.
 * @returns {Promise<any>} A promise that resolves with the user information.
 */
export const sendCodeToBackend = async (code: any): Promise<any> => {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: import.meta.env.VITE_CLIENTID, // Client ID obtained from environment variables
      client_secret: import.meta.env.VITE_SECRET, // Client secret obtained from environment variables
      redirect_uri: import.meta.env.VITE_REDIRECTURI, // Redirect URI obtained from environment variables
      grant_type: 'authorization_code' // Grant type for authorization
    })

    console.log(response)
    const access_token = response.data.access_token
    console.log(access_token)

    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}` // Attach access token in the authorization header
      }
    })

    if (userResponse && userResponse.data) {
      return userResponse.data
    } else {
      console.error('Error retrieving user information')
    }
  } catch (error) {
    console.error('Failed to send authorization code:', error)
  }
}
