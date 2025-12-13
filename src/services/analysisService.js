import { supabase } from '../lib/supabase';
import { storageService } from './storageService';


/**
 * Analysis Service
 * Manages video analysis sessions, database records, and results retrieval.
 */
export const analysisService = {
  /**
   * Creates a new analysis session in the database.
   * @param {Object} sessionData - Initial session data
   * @param {string} sessionData.sportId - ID of the selected sport
   * @param {string} sessionData.title - Title of the session
   * @param {string} sessionData.videoUrl - Storage path of the video
   * @returns {Promise<{data: Object, error: Object}>} The created session
   */
  async createSession(sessionData) {
    try {
      const user = await supabase?.auth?.getUser();
      if (!user?.data?.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase?.from('analysis_sessions')?.insert([{
        user_id: user?.data?.user?.id,
        sport_id: sessionData?.sportId,
        title: sessionData?.title,
        description: sessionData?.description || null,
        athlete_name: sessionData?.athleteName || null,
        session_date: sessionData?.sessionDate || new Date()?.toISOString()?.split('T')?.[0],
        video_url: sessionData?.videoUrl,
        thumbnail_url: sessionData?.thumbnailUrl || null,
        video_duration: sessionData?.videoDuration || null,
        status: 'uploading',
        focus_areas: sessionData?.focusAreas || [],
        tags: sessionData?.tags || []
      }])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating session:', error);
      return { data: null, error };
    }
  },

  /**
   * Updates an existing session with AI analysis results and scores.
   * @param {string} sessionId - UUID of the session
   * @param {Object} analysisResults - object containing scores and breakdown
   * @returns {Promise<{data: Object, error: Object}>} Updated session
   */
  async updateSessionWithResults(sessionId, analysisResults) {
    try {
      const { data, error } = await supabase?.from('analysis_sessions')?.update({
        status: 'completed',
        processing_completed_at: new Date()?.toISOString(),
        overall_score: analysisResults?.overallScore || null,
        posture_score: analysisResults?.postureScore || null,
        balance_score: analysisResults?.balanceScore || null,
        coordination_score: analysisResults?.coordinationScore || null,
        technique_score: analysisResults?.techniqueScore || null,
        power_score: analysisResults?.powerScore || null,
        endurance_score: analysisResults?.enduranceScore || null
      })?.eq('id', sessionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating session results:', error);
      return { data: null, error };
    }
  },

  /**
   * Updates the status of a session (e.g., 'processing', 'failed').
   * @param {string} sessionId - UUID of the session
   * @param {string} status - New status string
   * @param {string} [errorMessage] - Optional error message if failed
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async updateSessionStatus(sessionId, status, errorMessage = null) {
    try {
      const updateData = {
        status,
        ...(status === 'processing' && { processing_started_at: new Date()?.toISOString() }),
        ...(status === 'failed' && { error_message: errorMessage })
      };

      const { data, error } = await supabase?.from('analysis_sessions')?.update(updateData)?.eq('id', sessionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating session status:', error);
      return { data: null, error };
    }
  },

  /**
   * Retrieves a full session object, including signed URLs for media.
   * @param {string} sessionId - UUID of the session
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getSession(sessionId) {
    try {
      const { data: session, error } = await supabase?.from('analysis_sessions')?.select(`
          *,
          sport:sport_id(id, name, category)
        `)?.eq('id', sessionId)?.single();

      if (error) throw error;

      // Get signed URL for video
      if (session?.video_url) {
        const { data: videoData } = await storageService?.getVideoSignedUrl(session?.video_url);
        session.signedVideoUrl = videoData?.signedUrl;
      }

      // Get signed URL for thumbnail
      if (session?.thumbnail_url) {
        const { data: thumbData } = await storageService?.getThumbnailSignedUrl(session?.thumbnail_url);
        session.signedThumbnailUrl = thumbData?.signedUrl;
      }

      // Parse AI analysis if it exists
      if (session?.ai_analysis) {
        try {
          session.parsedAiAnalysis = typeof session?.ai_analysis === 'string'
            ? JSON.parse(session?.ai_analysis)
            : session?.ai_analysis;
        } catch (parseError) {
          console.warn('Failed to parse AI analysis:', parseError);
          session.parsedAiAnalysis = null;
        }
      }

      return { data: session, error: null };
    } catch (error) {
      console.error('Error fetching session:', error);
      return { data: null, error };
    }
  },

  /**
   * Fetches a paginated list of sessions for the current user.
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<{data: Array, count: number, error: Object}>}
   */
  async getUserSessions(options = {}) {
    try {
      const user = await supabase?.auth?.getUser();
      if (!user?.data?.user) {
        throw new Error('User not authenticated');
      }

      let query = supabase?.from('analysis_sessions')?.select(`
          *,
          sport:sport_id(id, name, category)
        `, { count: 'exact' })?.eq('user_id', user?.data?.user?.id)?.order('created_at', { ascending: false });

      // Apply filters
      if (options?.status) {
        query = query?.eq('status', options?.status);
      }

      if (options?.sportId) {
        query = query?.eq('sport_id', options?.sportId);
      }

      if (options?.isArchived !== undefined) {
        query = query?.eq('is_archived', options?.isArchived);
      }

      // Apply pagination
      const limit = options?.limit || 10;
      const offset = options?.offset || 0;
      query = query?.range(offset, offset + limit - 1);

      const { data: sessions, error, count } = await query;

      if (error) throw error;

      // Get signed URLs for each session
      const sessionsWithUrls = await Promise.all(
        (sessions || [])?.map(async (session) => {
          if (session?.video_url) {
            const { data: videoData } = await storageService?.getVideoSignedUrl(session?.video_url, 7200);
            session.signedVideoUrl = videoData?.signedUrl;
          }

          if (session?.thumbnail_url) {
            const { data: thumbData } = await storageService?.getThumbnailSignedUrl(session?.thumbnail_url, 7200);
            session.signedThumbnailUrl = thumbData?.signedUrl;
          }

          return session;
        })
      );

      return {
        data: sessionsWithUrls,
        count,
        error: null
      };
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return { data: null, count: 0, error };
    }
  },

  /**
   * Permanently deletes a session and its associated storage files.
   * @param {string} sessionId - UUID of the session
   * @returns {Promise<{error: Object}>}
   */
  async deleteSession(sessionId) {
    try {
      // Get session data first to delete associated files
      const { data: session } = await supabase?.from('analysis_sessions')?.select('video_url, thumbnail_url')?.eq('id', sessionId)?.single();

      // Delete video file
      if (session?.video_url) {
        await storageService?.deleteVideo(session?.video_url);
      }

      // Delete thumbnail file
      if (session?.thumbnail_url) {
        await storageService?.deleteThumbnail(session?.thumbnail_url);
      }

      // Delete session record (cascades to related tables)
      const { error } = await supabase?.from('analysis_sessions')?.delete()?.eq('id', sessionId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting session:', error);
      return { error };
    }
  },

  /**
   * Toggles the archived status of a session.
   * @param {string} sessionId - UUID of the session
   * @param {boolean} isArchived - New archived state
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async toggleArchiveSession(sessionId, isArchived) {
    try {
      const { data, error } = await supabase?.from('analysis_sessions')?.update({ is_archived: isArchived })?.eq('id', sessionId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error toggling archive status:', error);
      return { data: null, error };
    }
  },

  /**
   * Retrieves the user's most recent active session.
   * @returns {Promise<{data: Object, error: Object}>}
   */
  async getLatestSession() {
    try {
      const user = await supabase?.auth?.getUser();
      if (!user?.data?.user) {
        throw new Error('User not authenticated');
      }

      const { data: session, error } = await supabase?.from('analysis_sessions')?.select(`
          *,
          sport:sport_id(id, name, category)
        `)?.eq('user_id', user?.data?.user?.id)?.eq('is_archived', false)?.order('created_at', { ascending: false })?.limit(1)?.single();

      if (error && error?.code !== 'PGRST116') throw error; // Ignore not found error

      if (session) {
        // Get signed URLs
        if (session?.video_url) {
          const { data: videoData } = await storageService?.getVideoSignedUrl(session?.video_url);
          session.signedVideoUrl = videoData?.signedUrl;
        }

        if (session?.thumbnail_url) {
          const { data: thumbData } = await storageService?.getThumbnailSignedUrl(session?.thumbnail_url);
          session.signedThumbnailUrl = thumbData?.signedUrl;
        }
      }

      return { data: session || null, error: null };
    } catch (error) {
      console.error('Error fetching latest session:', error);
      return { data: null, error };
    }
  }
};

export default analysisService;