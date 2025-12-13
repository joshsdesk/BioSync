import React from 'react';
import './PhoneLoader.css';

const PhoneLoader = () => {
    return (
        <div className="phone-loader-wrapper mobile-loader">
            <div className="mobile-content">
                <div className="mobile-speaker"></div>
                <div className="mobile-screen">
                    <div className="mobile-face">
                        <div className="mobile-eyes">
                            <div className="left">
                                <span></span>
                            </div>
                            <div className="right">
                                <span></span>
                            </div>
                        </div>
                        <div className="mobile-mouth">
                            <div className="line-1"></div>
                            <div className="line-2"></div>
                            <div className="line-3"></div>
                        </div>
                    </div>
                </div>

                {/* Hands & Weights */}
                <div className="mobile-hand">
                    <div className="left">
                        <div className="hand"></div>
                        <div className="finger-wrap">
                            <div className="finger"></div>
                            <div className="finger-thumb"></div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="hand"></div>
                        <div className="finger-wrap">
                            <div className="finger-thumb"></div>
                            <div className="finger"></div>
                        </div>
                    </div>
                    <div className="dumbell-wrap">
                        <div className="dumbell-left"></div>
                        <div className="dumbell-right"></div>
                        <div className="dumbell-bar"></div>
                    </div>
                </div>
            </div>

            {/* Legs & Floor */}
            <div className="mobile-bottom">
                <div className="mobile-leg left"></div>
                <div className="mobile-leg right"></div>
            </div>
            <div className="bottom-border"></div>
        </div>
    );
};

export default PhoneLoader;
