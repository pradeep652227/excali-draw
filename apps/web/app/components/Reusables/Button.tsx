export default function Button({ label, className = '', type = 'button', ...props }) {
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