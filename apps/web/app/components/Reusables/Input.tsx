/* eslint-disable react/prop-types */
import { useId } from "react";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className = '', type = 'text', ...props },
  ref
) {
  const id = useId();

  return (
    <div className="flex gap-1">
      {label && <label htmlFor={id} className="font-medium text-gray-700">{label}</label>}
      <input
        id={id}
        type={type}
        ref={ref}
        className={`border-2 border-gray-900 ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;
