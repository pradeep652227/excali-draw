interface ButtonProps {
    label: string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    [key: string]: any;
}

export default function Button({ label, className = '', type = 'button', ...props }: ButtonProps) {
    return (
        <button
            type={type}
            className={`p-2 bg-blue-500 text-white rounded cursor-pointer ${className}`}
            {...props}
        >
            {label}
        </button>
    );
}