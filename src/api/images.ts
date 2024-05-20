import axios, { type AxiosResponse } from 'axios'

type SimpleResponse = {
  message: string
}

const imgApi = import.meta.env.VITE_IMAGEAPI

export const uploadImage = async (image: File): Promise<string> => {
  const form = new FormData()
  form.append('file', image)

  try {
    const imageUrl: AxiosResponse<SimpleResponse> = await axios.post(
      `${imgApi}/api/v1/upload`,
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return imageUrl.data.message
  } catch (error) {
    console.error('Error during image upload:', error)
    throw new Error('Error during image upload')
  }
}
