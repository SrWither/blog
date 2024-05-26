import axios, { type AxiosResponse } from 'axios'

type SimpleResponse = {
  message: string
}

const imgApi = import.meta.env.VITE_IMAGEAPI

/**
 * Uploads an image file to the specified image upload API endpoint.
 * @param image - The image file to upload.
 * @returns {Promise<string>} A promise that resolves to the URL of the uploaded image.
 * @throws {Error} Throws an error if there's an issue during the image upload process.
 */
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
