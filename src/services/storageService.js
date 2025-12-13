import { supabase } from '../lib/supabase';

/**
 * Storage Service
 * Handles all file upload, retrieval, and management operations with Supabase Storage.
 */
export const storageService = {
  /**
   * Uploads a training video to the user's private folder.
   * @param {File} file - The video file to upload
   * @param {string} userId - UUID of the user
   * @param {string} sessionId - UUID of the analysis session
   * @returns {Promise<{data: Object, error: Object}>} Result object containing path info or error
   */
  async uploadVideo(file, userId, sessionId) {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${sessionId}_${Date.now()}.${fileExt}`
      const filePath = `${userId}/videos/${fileName}`

      const { data, error } = await supabase?.storage?.from('training-videos')?.upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

      if (error) throw error

      return { data: { path: filePath, fullPath: data?.path }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Uploads a video thumbnail image.
   * @param {File} file - The image file
   * @param {string} userId - UUID of the user
   * @param {string} sessionId - UUID of the analysis session
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async uploadThumbnail(file, userId, sessionId) {
    try {
      const fileExt = file?.name?.split('.')?.pop() || 'jpg'
      const fileName = `${sessionId}_thumb_${Date.now()}.${fileExt}`
      const filePath = `${userId}/thumbnails/${fileName}`

      const { data, error } = await supabase?.storage?.from('video-thumbnails')?.upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

      if (error) throw error

      return { data: { path: filePath, fullPath: data?.path }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Uploads a user profile image.
   * @param {File} file - The image file
   * @param {string} userId - UUID of the user
   * @returns {Promise<{data: Object, error: Object}>} Result including public URL
   */
  async uploadProfileImage(file, userId) {
    try {
      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${userId}_profile.${fileExt}`
      const filePath = `profiles/${fileName}`

      const { data, error } = await supabase?.storage?.from('profile-images')?.upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

      if (error) throw error

      // Get public URL for profile images (public bucket)
      const { data: publicUrlData } = supabase?.storage?.from('profile-images')?.getPublicUrl(filePath)

      return {
        data: {
          path: filePath,
          fullPath: data?.path,
          publicUrl: publicUrlData?.publicUrl
        },
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Generates a signed URL for private video access.
   * @param {string} filePath - Path to the file in storage
   * @param {number} expiresIn - Expiration time in seconds (default: 3600)
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getVideoSignedUrl(filePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase?.storage?.from('training-videos')?.createSignedUrl(filePath, expiresIn)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Generates a signed URL for thumbnail access.
   * @param {string} filePath - Path to the file in storage
   * @param {number} expiresIn - Expiration time in seconds (default: 7200)
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getThumbnailSignedUrl(filePath, expiresIn = 7200) {
    try {
      const { data, error } = await supabase?.storage?.from('video-thumbnails')?.createSignedUrl(filePath, expiresIn)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Lists all videos for a specific user.
   * @param {string} userId - UUID of the user
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise<{data: Array, error: Object}>} List of files with signed URLs
   */
  async getUserVideos(userId, options = {}) {
    try {
      const { data: files, error: listError } = await supabase?.storage?.from('training-videos')?.list(`${userId}/videos`, {
        limit: options?.limit || 100,
        offset: options?.offset || 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

      if (listError) throw listError

      // Generate signed URLs for each file
      const filesWithUrls = await Promise.all(
        (files || [])?.map(async (file) => {
          const filePath = `${userId}/videos/${file?.name}`
          const { data: urlData } = await supabase?.storage?.from('training-videos')?.createSignedUrl(filePath, 3600)

          return {
            ...file,
            fullPath: filePath,
            signedUrl: urlData?.signedUrl,
            downloadUrl: urlData?.signedUrl
          }
        })
      )

      return {
        data: filesWithUrls?.filter(file => file?.signedUrl),
        error: null
      }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Deletes a video file.
   * @param {string} filePath - Path to the file
   * @returns {Promise<{error: Object}>}
   */
  async deleteVideo(filePath) {
    try {
      const { error } = await supabase?.storage?.from('training-videos')?.remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Deletes a thumbnail file.
   * @param {string} filePath - Path to the file
   * @returns {Promise<{error: Object}>}
   */
  async deleteThumbnail(filePath) {
    try {
      const { error } = await supabase?.storage?.from('video-thumbnails')?.remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Deletes a profile image.
   * @param {string} filePath - Path to the file
   * @returns {Promise<{error: Object}>}
   */
  async deleteProfileImage(filePath) {
    try {
      const { error } = await supabase?.storage?.from('profile-images')?.remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Client-side helper to generate an image thumbnail from a video file.
   * @param {File} videoFile - The video file source
   * @returns {Promise<File>} The generated thumbnail image file
   */
  async generateVideoThumbnail(videoFile) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      video.onloadedmetadata = () => {
        // Set canvas size
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Seek to 1 second (or 10% of video duration)
        video.currentTime = Math.min(1, video.duration * 0.1)
      }

      video.onseeked = () => {
        try {
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Create a file-like object
              const thumbnailFile = new File([blob], 'thumbnail.jpg', {
                type: 'image/jpeg'
              })
              resolve(thumbnailFile)
            } else {
              reject(new Error('Failed to generate thumbnail'))
            }
          }, 'image/jpeg', 0.8)
        } catch (error) {
          reject(error)
        }
      }

      video.onerror = () => {
        reject(new Error('Failed to load video for thumbnail generation'))
      }

      // Load video
      video.src = URL.createObjectURL(videoFile)
      video.load()
    })
  }
}

export default storageService