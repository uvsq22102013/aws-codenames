import { FC, ButtonHTMLAttributes } from "react";

type ButtonVariant = 
  | "solid" 
  | "outline";

type ButtonColor = 
  | "default" 
  | "alternative" 
  | "dark" 
  | "light" 
  | "green" 
  | "red" 
  | "yellow" 
  | "purple";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
}

const Button: FC<ButtonProps> = ({
  variant = "solid",
  color = "default",
  className = "",
  children,
  ...props
}) => {
  const baseClasses = "font-medium rounded-full text-sm px-5 py-2.5 text-center transition-all focus:outline-none";

  const variantClasses = {
    "solid-default": "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    "solid-green": "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
    "solid-red": "text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
    "solid-yellow": "text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900",
    "solid-purple": "text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900",
    "solid-dark": "text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700",
    
    "outline-default": "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700",
    "outline-alternative": "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
  };

  const colorVariantKey = `${variant}-${color}` as keyof typeof variantClasses;

  return (
    <button
      className={`${baseClasses} ${variantClasses[colorVariantKey]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;