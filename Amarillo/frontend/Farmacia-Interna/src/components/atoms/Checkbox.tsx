import React from 'react';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox: React.FC<CheckboxProps> = ({ className, ...props }) => {
    return (
        <input
            type="checkbox"
            className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
            {...props}
        />
    );
};