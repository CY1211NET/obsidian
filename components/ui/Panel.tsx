import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`glass-panel p-6 rounded-lg ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
