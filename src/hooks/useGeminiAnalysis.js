import { useState, useRef } from 'react';
import { 
  analyzeBiomechanicalMovement, 
  generateMovementCritiques, 
  generateTrainingRecommendations,
  generateCoachingTips,
  analyzeVideoMovement,
  handleGeminiError 
} from '../services/geminiAnalysis';

/**
 * React hook for managing AI-powered biomechanical analysis with Gemini.
 * @returns {Object} Hook utilities for AI analysis operations
 */
export function useGeminiAnalysis() {
  const abortControllerRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [error, setError] = useState(null);

  const startAnalysis = async (analysisFunction) => {
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStage('Initializing AI analysis...');
    setError(null);

    try {
      // Progress simulation for better UX
      const progressStages = [
        { stage: 'Processing movement data...', progress: 15 },
        { stage: 'Analyzing biomechanics...', progress: 35 },
        { stage: 'Generating insights...', progress: 60 },
        { stage: 'Preparing recommendations...', progress: 85 },
        { stage: 'Finalizing analysis...', progress: 95 }
      ];

      // Start progress simulation
      let currentStageIndex = 0;
      const progressInterval = setInterval(() => {
        if (currentStageIndex < progressStages?.length) {
          const stage = progressStages?.[currentStageIndex];
          setAnalysisStage(stage?.stage);
          setAnalysisProgress(stage?.progress);
          currentStageIndex++;
        }
      }, 1500);

      // Execute the actual analysis
      const result = await analysisFunction(abortControllerRef?.current?.signal);
      
      // Clean up progress simulation
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysisStage('Analysis complete!');
      
      return result;
    } catch (err) {
      setError(handleGeminiError(err));
      throw err;
    } finally {
      setIsAnalyzing(false);
      abortControllerRef.current = null;
    }
  };

  const cancelAnalysis = () => {
    if (abortControllerRef?.current) {
      abortControllerRef?.current?.abort();
      setIsAnalyzing(false);
      setAnalysisStage('Analysis cancelled');
      setAnalysisProgress(0);
    }
  };

  /**
   * Performs comprehensive biomechanical analysis
   */
  const performBiomechanicalAnalysis = async (movementData, sport = "General") => {
    return await startAnalysis(async (signal) => {
      return await analyzeBiomechanicalMovement(movementData, sport, signal);
    });
  };

  /**
   * Generates AI-powered movement critiques
   */
  const generateAICritiques = async (timeStampedIssues, sport, athleteLevel = "intermediate") => {
    return await startAnalysis(async () => {
      return await generateMovementCritiques(timeStampedIssues, sport, athleteLevel);
    });
  };

  /**
   * Creates personalized training recommendations
   */
  const createTrainingPlan = async (analysisData, sport, athleteProfile = {}) => {
    return await startAnalysis(async () => {
      return await generateTrainingRecommendations(analysisData, sport, athleteProfile);
    });
  };

  /**
   * Generates real-time coaching tips
   */
  const getCoachingTips = async (movementPhase, currentIssues, sport) => {
    return await startAnalysis(async () => {
      return await generateCoachingTips(movementPhase, currentIssues, sport);
    });
  };

  /**
   * Performs video-based movement analysis
   */
  const analyzeVideo = async (videoFile, sport, focusArea = "overall technique") => {
    return await startAnalysis(async () => {
      return await analyzeVideoMovement(videoFile, sport, focusArea);
    });
  };

  const clearError = () => setError(null);

  return {
    // States
    isAnalyzing,
    analysisProgress,
    analysisStage,
    error,
    
    // Actions
    performBiomechanicalAnalysis,
    generateAICritiques,
    createTrainingPlan,
    getCoachingTips,
    analyzeVideo,
    cancelAnalysis,
    clearError
  };
}

/**
 * Hook for managing AI chat sessions with movement context
 */
export function useGeminiChat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (message, movementContext = null) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Add user message to history
      const userMessage = { role: 'user', content: message, timestamp: new Date() };
      setChatHistory(prev => [...prev, userMessage]);

      // Create context-aware prompt
      let contextPrompt = message;
      if (movementContext) {
        contextPrompt = `
Movement Context: ${JSON.stringify(movementContext)}

User Question: ${message}

Please provide a helpful response considering the movement analysis context provided.
`;
      }

      // For now, simulate AI response (replace with actual Gemini chat when needed)
      const simulatedResponse = {
        role: 'assistant',
        content: `I understand your question about "${message}". Based on the movement analysis, I recommend focusing on proper form and technique. Would you like more specific guidance?`,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, simulatedResponse]);
      return simulatedResponse;
      
    } catch (err) {
      const errorMsg = handleGeminiError(err);
      setError(errorMsg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setError(null);
  };

  return {
    chatHistory,
    isProcessing,
    error,
    sendMessage,
    clearChat
  };
}