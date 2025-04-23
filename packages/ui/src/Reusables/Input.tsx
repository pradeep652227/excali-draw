/* eslint-disable react/prop-types */
import { useId } from "react";

export default function Input({ label, className = '', type = 'text', ...props }) {
    const id = useId();

    return (
        <div className="flex gap-1 bg-red-300">
            {label && <label htmlFor={id} className="font-medium text-gray-700">{label}</label>}
            <input
                id={id}
                type={type}
                className={`!p-2 !border-2 !border-gray-900 !rounded-md focus:!outline-none focus:!ring-2 focus:!ring-blue-500 ${className}`}
                {...props}
            />
        </div>
    );
}
