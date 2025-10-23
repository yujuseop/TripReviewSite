import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dots" | "pulse" | "spinner" | "bars";
  color?: "primary" | "secondary" | "white" | "gray";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "spinner",
  color = "primary",
  className = "",
  text,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    primary: "text-blue-600",
    secondary: "text-purple-600",
    white: "text-white",
    gray: "text-gray-600",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const renderSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className={`flex space-x-1 ${sizeClasses[size]}`}>
            <div
              className={`w-2 h-2 bg-current rounded-full animate-bounce-smooth ${colorClasses[color]}`}
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className={`w-2 h-2 bg-current rounded-full animate-bounce-smooth ${colorClasses[color]}`}
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className={`w-2 h-2 bg-current rounded-full animate-bounce-smooth ${colorClasses[color]}`}
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        );

      case "pulse":
        return (
          <div
            className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse-smooth`}
          >
            <div className="w-full h-full bg-current rounded-full"></div>
          </div>
        );

      case "bars":
        return (
          <div className={`flex items-end space-x-1 ${sizeClasses[size]}`}>
            <div
              className={`w-1 bg-current animate-bars-pulse ${colorClasses[color]}`}
              style={{ height: "25%", animationDelay: "0ms" }}
            ></div>
            <div
              className={`w-1 bg-current animate-bars-pulse ${colorClasses[color]}`}
              style={{ height: "50%", animationDelay: "150ms" }}
            ></div>
            <div
              className={`w-1 bg-current animate-bars-pulse ${colorClasses[color]}`}
              style={{ height: "75%", animationDelay: "300ms" }}
            ></div>
            <div
              className={`w-1 bg-current animate-bars-pulse ${colorClasses[color]}`}
              style={{ height: "100%", animationDelay: "450ms" }}
            ></div>
          </div>
        );

      case "spinner":
      default:
        return (
          <div
            className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin-smooth`}
          >
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="60 40"
                className="opacity-25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="opacity-75"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderSpinner()}
      {text && (
        <p
          className={`mt-2 ${textSizeClasses[size]} ${colorClasses[color]} font-medium`}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
