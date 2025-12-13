import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

/**
 * AppIcon Component
 * Wrapper around Lucide icons to provide a consistent interface and safe fallback.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.name - The name of the Lucide icon to render (case-sensitive)
 * @param {number} [props.size=24] - Size of the icon in pixels
 * @param {string} [props.color="currentColor"] - Color of the icon
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.strokeWidth=2] - Stroke width of the icon
 */
function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    const IconComponent = LucideIcons?.[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;