import React from 'react';
import BrainLoader from './BrainLoader';
import PhoneLoader from './PhoneLoader';

/**
 * LoadingOverlay Component
 * 
 * Displays a full-screen loading modal with a blurred background.
 * 
 * @param {boolean} visible - Whether the overlay is visible.
 * @param {'phone' | 'brain'} variant - Which animation to show. 'phone' for general loading, 'brain' for video analysis.
 * @param {string} message - Optional text message to display below the loader.
 */
const LoadingOverlay = ({ visible, variant = 'phone', message }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
            <div className="relative p-10 rounded-2xl bg-white/5 shadow-2xl border border-white/10 flex flex-col items-center">
                {/* Glow effect behind the loader */}
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

                <div className="relative z-10 scale-75 md:scale-100">
                    {variant === 'brain' ? <BrainLoader /> : <PhoneLoader />}
                </div>

                {message && (
                    <p className="relative z-10 mt-6 text-xl font-bold text-white text-center tracking-widest uppercase opacity-90 animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoadingOverlay;
