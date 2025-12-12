import React, { useState, useEffect } from 'react';

const SkeletalOverlay = ({ overlayData, currentTime, isVisible }) => {
  const [focusArea, setFocusArea] = useState(null);
  const [expertSummary, setExpertSummary] = useState('');

  // Simulate time-based focus areas and expert summaries
  useEffect(() => {
    if (!isVisible || !overlayData) return;

    // Update focus area based on video time
    const timeInSeconds = Math.floor(currentTime);
    
    if (timeInSeconds >= 0 && timeInSeconds < 10) {
      setFocusArea('Knee Alignment');
      setExpertSummary('Keep knees tracking over toes during descent');
    } else if (timeInSeconds >= 10 && timeInSeconds < 20) {
      setFocusArea('Hip Stability');
      setExpertSummary('Engage glutes to maintain proper hip position');
    } else if (timeInSeconds >= 20 && timeInSeconds < 30) {
      setFocusArea('Core Engagement');
      setExpertSummary('Maintain upright posture through the movement');
    } else {
      setFocusArea('Overall Form');
      setExpertSummary('Coordinate all movement patterns smoothly');
    }
  }, [currentTime, isVisible, overlayData]);

  if (!isVisible || !overlayData) return null;

  // Define joint status colors
  const getJointColor = (confidence, hasError = false) => {
    if (hasError) return '#EF4444'; // Red for errors
    if (confidence >= 0.85) return '#10B981'; // Green for good alignment
    if (confidence >= 0.7) return '#F59E0B'; // Yellow for needs improvement
    return '#EF4444'; // Red for poor alignment
  };

  // Define body connections (human skeleton structure)
  const bodyConnections = [
    // Torso
    { from: 0, to: 1, label: 'neck' },
    { from: 1, to: 2, label: 'spine' },
    { from: 2, to: 3, label: 'lower_back' },
    
    // Left side
    { from: 1, to: 4, label: 'left_shoulder' },
    { from: 4, to: 5, label: 'left_upper_arm' },
    { from: 5, to: 6, label: 'left_forearm' },
    
    // Right side
    { from: 1, to: 7, label: 'right_shoulder' },
    { from: 7, to: 8, label: 'right_upper_arm' },
    { from: 8, to: 9, label: 'right_forearm' },
    
    // Left leg
    { from: 3, to: 10, label: 'left_hip' },
    { from: 10, to: 11, label: 'left_thigh' },
    { from: 11, to: 12, label: 'left_shin' },
    
    // Right leg
    { from: 3, to: 13, label: 'right_hip' },
    { from: 13, to: 14, label: 'right_thigh' },
    { from: 14, to: 15, label: 'right_shin' },
  ];

  // Mock joint data (in real implementation, this would come from AI analysis)
  const joints = [
    { x: 320, y: 100, confidence: 0.95, name: 'head' }, // 0
    { x: 320, y: 150, confidence: 0.92, name: 'neck' }, // 1
    { x: 320, y: 220, confidence: 0.90, name: 'upper_torso' }, // 2
    { x: 320, y: 280, confidence: 0.88, name: 'lower_torso' }, // 3
    { x: 280, y: 160, confidence: 0.85, name: 'left_shoulder' }, // 4
    { x: 250, y: 210, confidence: 0.82, name: 'left_elbow' }, // 5
    { x: 230, y: 260, confidence: 0.78, name: 'left_wrist' }, // 6
    { x: 360, y: 160, confidence: 0.87, name: 'right_shoulder' }, // 7
    { x: 390, y: 210, confidence: 0.65, name: 'right_elbow' }, // 8 - needs improvement
    { x: 410, y: 260, confidence: 0.68, name: 'right_wrist' }, // 9 - needs improvement
    { x: 295, y: 290, confidence: 0.90, name: 'left_hip' }, // 10
    { x: 290, y: 360, confidence: 0.62, name: 'left_knee' }, // 11 - error
    { x: 285, y: 430, confidence: 0.85, name: 'left_ankle' }, // 12
    { x: 345, y: 290, confidence: 0.91, name: 'right_hip' }, // 13
    { x: 350, y: 360, confidence: 0.88, name: 'right_knee' }, // 14
    { x: 355, y: 430, confidence: 0.86, name: 'right_ankle' }, // 15
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 640 480">
        {/* Define gradient for glow effects */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <radialGradient id="jointGradient">
            <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="white" stopOpacity="0.2"/>
          </radialGradient>
        </defs>

        {/* Skeletal connections with color coding */}
        {bodyConnections?.map((connection, index) => {
          const fromJoint = joints?.[connection?.from];
          const toJoint = joints?.[connection?.to];
          if (!fromJoint || !toJoint) return null;

          const avgConfidence = (fromJoint?.confidence + toJoint?.confidence) / 2;
          const hasError = avgConfidence < 0.7;
          const color = getJointColor(avgConfidence, hasError);

          return (
            <g key={index}>
              {/* Connection line with gradient */}
              <line
                x1={fromJoint?.x}
                y1={fromJoint?.y}
                x2={toJoint?.x}
                y2={toJoint?.y}
                stroke={color}
                strokeWidth="4"
                opacity="0.85"
                filter="url(#glow)"
                strokeLinecap="round"
              >
                {/* Animated pulse for error areas */}
                {hasError && (
                  <animate
                    attributeName="stroke-width"
                    values="4;6;4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
              
              {/* Connection shadow for depth */}
              <line
                x1={fromJoint?.x}
                y1={fromJoint?.y}
                x2={toJoint?.x}
                y2={toJoint?.y}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="5"
                opacity="0.3"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Joint markers with color coding and animation */}
        {joints?.map((joint, index) => {
          const color = getJointColor(joint?.confidence);
          const hasError = joint?.confidence < 0.7;
          const needsImprovement = joint?.confidence >= 0.7 && joint?.confidence < 0.85;

          return (
            <g key={index}>
              {/* Outer ring for emphasis */}
              <circle
                cx={joint?.x}
                cy={joint?.y}
                r="8"
                fill="none"
                stroke={color}
                strokeWidth="2"
                opacity="0.6"
              >
                {(hasError || needsImprovement) && (
                  <animate
                    attributeName="r"
                    values="8;12;8"
                    dur={hasError ? "1s" : "2s"}
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Main joint marker */}
              <circle
                cx={joint?.x}
                cy={joint?.y}
                r="5"
                fill={color}
                stroke="white"
                strokeWidth="2"
                filter="url(#glow)"
              >
                {/* Breathing animation for problematic joints */}
                {hasError && (
                  <animate
                    attributeName="opacity"
                    values="1;0.5;1"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>

              {/* Inner highlight */}
              <circle
                cx={joint?.x - 1}
                cy={joint?.y - 1}
                r="2"
                fill="url(#jointGradient)"
                opacity="0.8"
              />
            </g>
          );
        })}

        {/* Error area highlights with animated rings */}
        {overlayData?.errorAreas?.map((area, index) => (
          <g key={`error-${index}`}>
            {/* Pulsing error ring */}
            <circle
              cx={area?.x}
              cy={area?.y}
              r="25"
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              strokeDasharray="5,5"
              opacity="0.7"
            >
              <animate
                attributeName="r"
                values="20;30;20"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;0.3;0.7"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Inner warning ring */}
            <circle
              cx={area?.x}
              cy={area?.y}
              r="15"
              fill="#EF4444"
              opacity="0.2"
            >
              <animate
                attributeName="r"
                values="10;18;10"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Focus Area Info Box - Top Left */}
      {focusArea && (
        <div className="absolute top-4 left-4 bg-slate-900 bg-opacity-90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 max-w-xs pointer-events-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-1">Current Focus</h4>
              <p className="text-base font-medium">{focusArea}</p>
            </div>
          </div>
        </div>
      )}

      {/* Expert Summary - Bottom Left */}
      {expertSummary && (
        <div className="absolute bottom-20 left-4 bg-slate-900 bg-opacity-90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 max-w-sm pointer-events-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-1">Expert Tip</h4>
              <p className="text-sm leading-relaxed">{expertSummary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Color Legend - Top Right */}
      <div className="absolute top-4 right-4 bg-slate-900 bg-opacity-90 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 pointer-events-auto">
        <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Joint Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Good Alignment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Needs Improvement</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Error Detected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletalOverlay;