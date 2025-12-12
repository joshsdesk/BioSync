import { supabase } from '../lib/supabase';

export const storageService = {
  // Upload training video
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

  // Upload video thumbnail
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

  // Upload profile image
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

  // Get signed URL for private video
  async getVideoSignedUrl(filePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase?.storage?.from('training-videos')?.createSignedUrl(filePath, expiresIn)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Get signed URL for private thumbnail
  async getThumbnailSignedUrl(filePath, expiresIn = 7200) {
    try {
      const { data, error } = await supabase?.storage?.from('video-thumbnails')?.createSignedUrl(filePath, expiresIn)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // List user's videos
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

  // Delete video file
  async deleteVideo(filePath) {
    try {
      const { error } = await supabase?.storage?.from('training-videos')?.remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Delete thumbnail file
  async deleteThumbnail(filePath) {
    try {
      const { error } = await supabase?.storage?.from('video-thumbnails')?.remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Delete profile image
  async deleteProfileImage(filePath) {
    try {
      const { error } = await supabase?.storage?.from('profile-images')?.remove([filePath])

      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  // Generate thumbnail from video (client-side)
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