import genAI from './geminiClient';

/**
 * Handles common Gemini API errors with user-friendly messages.
 * @param {Error} error - The error object from the API.
 * @returns {string} User-friendly error message.
 */
export function handleGeminiError(error) {
  console.error('Gemini API Error:', error);

  if (error?.message?.includes('429')) {
    return 'Rate limit exceeded. Please wait a moment before trying again.';
  }
  
  if (error?.message?.includes('SAFETY')) {
    return 'Content was blocked by safety filters. Please modify your request.';
  }
  
  if (error?.message?.includes('cancelled')) {
    return 'Request was cancelled by user.';
  }
  
  if (error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  if (error?.message?.includes('API key')) {
    return 'API key is invalid or missing. Please check your configuration.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Comprehensive safety settings for content filtering.
 * @returns {Array} Safety settings configuration.
 */
export function getSafetySettings() {
  return [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    }
  ];
}

/**
 * Analyzes biomechanical movement data using Gemini AI.
 * @param {Object} movementData - The movement analysis data
 * @param {string} sport - The sport being analyzed
 * @param {AbortSignal} signal - Optional abort signal for cancellation
 * @returns {Promise<Object>} AI-generated movement analysis
 */
export async function analyzeBiomechanicalMovement(movementData, sport = "General", signal = null) {
  try {
    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      safetySettings: getSafetySettings()
    });

    const analysisPrompt = `
As an expert biomechanical analyst and sports performance coach, analyze the following movement data for a ${sport} athlete:

Movement Data:
- Joint Angles: ${JSON.stringify(movementData?.jointAngles)}
- Key Points: ${JSON.stringify(movementData?.keyPoints)}
- Movement Phase: ${movementData?.phase || 'Unknown'}
- Duration: ${movementData?.duration || 'Unknown'} seconds

Please provide a comprehensive analysis including:

1. **Critical Issues** (if any): Identify movement patterns that could lead to injury or performance reduction
2. **Technical Assessment**: Evaluate the biomechanical efficiency of the movement
3. **Specific Recommendations**: Provide actionable feedback for improvement
4. **Corrective Exercises**: Suggest 2-3 specific drills or exercises to address identified issues
5. **Performance Scoring**: Rate the movement on a scale of 1-100 for:
   - Overall technique
   - Safety/injury risk
   - Efficiency
   - Sport-specific effectiveness

Format the response as a structured JSON object with clear sections for each analysis component.
Focus on being constructive, specific, and actionable in your recommendations.
`;

    const requestConfig = {
      contents: [{ role: "user", parts: [{ text: analysisPrompt }] }],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 32,
        maxOutputTokens: 2000,
      },
      safetySettings: getSafetySettings(),
    };

    const geminiRequest = model?.generateContent(requestConfig);
    
    let result;
    if (signal) {
      const cancellationPromise = new Promise((_, reject) => {
        signal.addEventListener('abort', () => {
          reject(new Error('Analysis was cancelled by user.'));
        });
      });
      
      result = await Promise.race([geminiRequest, cancellationPromise]);
    } else {
      result = await geminiRequest;
    }

    const response = await result?.response;
    const analysisText = response?.text();

    // Try to parse as JSON, fallback to structured text
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      // If JSON parsing fails, create structured response from text
      return {
        aiGenerated: true,
        rawAnalysis: analysisText,
        summary: "AI-generated biomechanical analysis",
        timestamp: new Date()?.toISOString()
      };
    }
    
  } catch (error) {
    console.error('Error in biomechanical analysis:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Generates personalized movement critiques using Gemini AI.
 * @param {Array} timeStampedIssues - Array of movement issues with timestamps
 * @param {string} sport - The sport being analyzed
 * @param {string} athleteLevel - beginner, intermediate, advanced
 * @returns {Promise<Array>} Array of detailed movement critiques
 */
export async function generateMovementCritiques(timeStampedIssues, sport, athleteLevel = "intermediate") {
  try {
    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      safetySettings: getSafetySettings()
    });

    const critiquePrompt = `
As a biomechanical expert specializing in ${sport}, analyze these movement issues and create detailed critiques:

Issues Found:
${timeStampedIssues?.map(issue => `
- Timestamp: ${issue?.timestamp}s
- Issue: ${issue?.description}
- Severity: ${issue?.severity}
- Body Part: ${issue?.bodyPart || 'General'}
`)?.join('\n')}

Athlete Level: ${athleteLevel}

For each issue, provide:
1. **Title**: Clear, descriptive name for the movement fault
2. **Description**: Detailed explanation of what's happening and why it's problematic
3. **Severity Level**: critical, major, or minor
4. **Focus Points**: 3-4 key technical cues the athlete should remember
5. **Recommendations**: 3-4 specific exercises or drills to address this issue
6. **Progression**: How to advance the corrective work as they improve

Tailor the language and complexity to the athlete's level. Be encouraging but specific about the corrections needed.

Return as a JSON array of critique objects.
`;

    let result = await model?.generateContent(critiquePrompt);
    const response = await result?.response;
    const critiquesText = response?.text();

    try {
      const critiques = JSON.parse(critiquesText);
      return Array.isArray(critiques) ? critiques : [critiques];
    } catch (parseError) {
      // Fallback structure if JSON parsing fails
      return timeStampedIssues?.map((issue, index) => ({
        timestamp: issue?.timestamp,
        severity: issue?.severity || "major",
        title: `Movement Issue ${index + 1}`,
        description: critiquesText?.substring(0, 200) + "...",
        focusPoints: ["Focus on proper form", "Maintain body alignment", "Control movement speed"],
        recommendations: ["Practice basic technique", "Strengthen supporting muscles", "Work with a coach"],
        aiGenerated: true
      }));
    }
    
  } catch (error) {
    console.error('Error generating movement critiques:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Generates personalized training recommendations using Gemini AI.
 * @param {Object} analysisData - Complete movement analysis data
 * @param {string} sport - The sport being analyzed
 * @param {Object} athleteProfile - Athlete's profile information
 * @returns {Promise<Object>} Personalized training recommendations
 */
export async function generateTrainingRecommendations(analysisData, sport, athleteProfile = {}) {
  try {
    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      safetySettings: getSafetySettings()
    });

    const recommendationPrompt = `
As a performance coach specializing in ${sport}, create a personalized training plan based on this movement analysis:

Analysis Summary:
- Overall Score: ${analysisData?.scores?.overall || 'Not available'}
- Key Weaknesses: ${JSON.stringify(analysisData?.weaknesses || [])}
- Strengths: ${JSON.stringify(analysisData?.strengths || [])}
- Movement Issues: ${JSON.stringify(analysisData?.issues || [])}

Athlete Profile:
- Experience Level: ${athleteProfile?.level || 'Intermediate'}
- Age Group: ${athleteProfile?.ageGroup || 'Adult'}
- Training Goals: ${athleteProfile?.goals || 'Performance improvement'}
- Available Training Time: ${athleteProfile?.timeAvailable || '3-4 sessions per week'}

Generate recommendations including:

1. **Priority Focus Areas**: Top 3 areas that need immediate attention
2. **Strength Training**: Specific exercises targeting identified weaknesses
3. **Mobility Work**: Stretching and mobility exercises for problem areas
4. **Skill Development**: Technical drills to improve movement patterns
5. **Progression Plan**: How to advance over the next 4-8 weeks
6. **Recovery Protocols**: Rest and recovery recommendations
7. **Success Metrics**: How to measure improvement

Make recommendations specific, actionable, and appropriate for the athlete's level and sport.

Return as a structured JSON object.
`;

    let result = await model?.generateContent(recommendationPrompt);
    const response = await result?.response;
    const recommendationsText = response?.text();

    try {
      return JSON.parse(recommendationsText);
    } catch (parseError) {
      return {
        aiGenerated: true,
        summary: "Personalized training recommendations generated by AI",
        rawRecommendations: recommendationsText,
        timestamp: new Date()?.toISOString(),
        focusAreas: ["Technique refinement", "Strength development", "Movement efficiency"]
      };
    }
    
  } catch (error) {
    console.error('Error generating training recommendations:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Generates contextual coaching tips using Gemini AI.
 * @param {string} movementPhase - Current phase of movement being analyzed
 * @param {Object} currentIssues - Current movement issues detected
 * @param {string} sport - The sport being analyzed
 * @returns {Promise<Array>} Array of coaching tips
 */
export async function generateCoachingTips(movementPhase, currentIssues, sport) {
  try {
    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      safetySettings: getSafetySettings()
    });

    const tipsPrompt = `
As an experienced ${sport} coach, provide immediate coaching tips for this situation:

Movement Phase: ${movementPhase}
Current Issues: ${JSON.stringify(currentIssues)}

Provide 3-5 short, actionable coaching cues that an athlete can immediately apply. 
Each tip should be:
- Clear and concise (one sentence)
- Immediately actionable
- Specific to the movement phase and issues identified
- Encouraging and constructive

Format as a JSON array of tip objects with "tip" and "focus" properties.
`;

    let result = await model?.generateContent(tipsPrompt);
    const response = await result?.response;
    const tipsText = response?.text();

    try {
      const tips = JSON.parse(tipsText);
      return Array.isArray(tips) ? tips : [tips];
    } catch (parseError) {
      return [
        {
          tip: "Focus on maintaining proper alignment throughout the movement",
          focus: "Form and technique"
        },
        {
          tip: "Engage your core muscles to improve stability",
          focus: "Stability and control"
        },
        {
          tip: "Move with controlled rhythm rather than rushing",
          focus: "Timing and coordination"
        }
      ];
    }
    
  } catch (error) {
    console.error('Error generating coaching tips:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Analyzes video frames for biomechanical assessment using Gemini's multimodal capabilities.
 * @param {File} videoFile - Video file for analysis  
 * @param {string} sport - The sport being analyzed
 * @param {string} focusArea - Specific area to focus analysis on
 * @returns {Promise<Object>} Video analysis results
 */
export async function analyzeVideoMovement(videoFile, sport, focusArea = "overall technique") {
  try {
    const model = genAI?.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      safetySettings: getSafetySettings()
    });

    // Convert video file to base64 (note: for large videos, consider frame extraction)
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });

    const videoBase64 = await toBase64(videoFile);
    const videoPart = {
      inlineData: {
        data: videoBase64,
        mimeType: videoFile?.type,
      },
    };

    const analysisPrompt = `
Analyze this ${sport} movement video with focus on ${focusArea}. 

Provide detailed biomechanical assessment including:
1. **Movement Quality**: Overall assessment of technique
2. **Key Observations**: Specific movement patterns noticed
3. **Areas of Concern**: Any movement faults or injury risk factors
4. **Strengths**: What the athlete is doing well
5. **Specific Recommendations**: Targeted advice for improvement
6. **Scoring**: Rate key aspects (posture, balance, coordination, technique) on 1-100 scale

Be specific about body positioning, joint angles, and movement sequencing.
Return as structured JSON.
`;

    let result = await model?.generateContent([analysisPrompt, videoPart]);
    const response = await result?.response;
    const analysisText = response?.text();

    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      return {
        aiGenerated: true,
        videoAnalysis: analysisText,
        summary: "AI-powered video movement analysis",
        timestamp: new Date()?.toISOString()
      };
    }
    
  } catch (error) {
    console.error('Error in video analysis:', error);
    throw new Error(handleGeminiError(error));
  }
}