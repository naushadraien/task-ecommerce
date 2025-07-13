import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

export interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  description?: string;
  variant?: "default" | "minimal" | "card" | "fullscreen";
  theme?: "blue" | "green" | "purple" | "orange" | "gray";
  className?: string;
  showDots?: boolean;
  icon?: React.ReactNode;
  direction?: "vertical" | "horizontal";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const themeClasses = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  purple: "text-purple-600 dark:text-purple-400",
  orange: "text-orange-600 dark:text-orange-400",
  gray: "text-gray-600 dark:text-gray-400",
};

const dotThemeClasses = {
  blue: "bg-blue-600 dark:bg-blue-400",
  green: "bg-green-600 dark:bg-green-400",
  purple: "bg-purple-600 dark:bg-purple-400",
  orange: "bg-orange-600 dark:bg-orange-400",
  gray: "bg-gray-600 dark:bg-gray-400",
};

const LoadingDots = ({ theme = "blue" }: { theme?: LoaderProps["theme"] }) => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={cn(
          "w-2 h-2 rounded-full animate-bounce",
          dotThemeClasses[theme]
        )}
        style={{
          animationDelay: `${i * 0.1}s`,
          animationDuration: "0.6s",
        }}
      />
    ))}
  </div>
);

export default function Loader({
  size = "md",
  text = "Loading...",
  description,
  variant = "default",
  theme = "blue",
  className,
  showDots = false,
  icon,
  direction = "vertical",
}: LoaderProps) {
  const spinnerIcon = icon || (
    <Loader2
      className={cn("animate-spin", sizeClasses[size], themeClasses[theme])}
    />
  );

  const isHorizontal = direction === "horizontal";

  // Minimal variant
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        {spinnerIcon}
      </div>
    );
  }

  // Fullscreen variant
  if (variant === "fullscreen") {
    return (
      <div
        className={cn(
          "fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50",
          "flex flex-col items-center justify-center",
          className
        )}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
          <div
            className={cn(
              "flex items-center",
              isHorizontal ? "flex-row space-x-4" : "flex-col space-y-4"
            )}
          >
            {spinnerIcon}
            <div className={cn("text-center", isHorizontal && "text-left")}>
              <p className="text-gray-900 dark:text-white text-lg font-medium">
                {text}
              </p>
              {description && (
                <p
                  className={cn(
                    "text-gray-500 dark:text-gray-400 text-sm",
                    isHorizontal ? "mt-1" : "mt-2"
                  )}
                >
                  {description}
                </p>
              )}
            </div>
            {showDots && <LoadingDots theme={theme} />}
          </div>
        </div>
      </div>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8",
          "flex flex-col items-center justify-center min-h-[300px]",
          className
        )}
      >
        <div
          className={cn(
            "flex items-center",
            isHorizontal ? "flex-row space-x-4" : "flex-col space-y-4"
          )}
        >
          {spinnerIcon}
          <div className={cn("text-center", isHorizontal && "text-left")}>
            <p className="text-gray-900 dark:text-white text-lg font-medium">
              {text}
            </p>
            {description && (
              <p
                className={cn(
                  "text-gray-500 dark:text-gray-400 text-sm",
                  isHorizontal ? "mt-1" : "mt-2"
                )}
              >
                {description}
              </p>
            )}
          </div>
          {showDots && <LoadingDots theme={theme} />}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        isHorizontal ? "flex-row space-x-3" : "flex-col space-y-3",
        className
      )}
    >
      {spinnerIcon}
      <div className={cn("text-center", isHorizontal && "text-left")}>
        <p
          className={cn(
            "font-medium",
            size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base",
            "text-gray-900 dark:text-white"
          )}
        >
          {text}
        </p>
        {description && (
          <p
            className={cn(
              "text-gray-500 dark:text-gray-400",
              size === "sm" ? "text-xs" : "text-sm",
              isHorizontal ? "mt-1" : "mt-2"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {showDots && <LoadingDots theme={theme} />}
    </div>
  );
}

export const ProductLoader = () => (
  <Loader
    variant="card"
    text="Loading products..."
    description="Please wait while we fetch the latest products"
    theme="blue"
    size="lg"
  />
);

export const PageLoader = () => (
  <Loader
    variant="fullscreen"
    text="Loading..."
    description="Please wait a moment"
    theme="blue"
    size="xl"
  />
);

export const ButtonLoader = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex items-center space-x-2">
    <Loader variant="minimal" size="sm" theme="gray" />
    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
      {text}
    </span>
  </div>
);

export const InlineLoader = ({ text = "Loading..." }: { text?: string }) => (
  <Loader
    text={text}
    size="sm"
    theme="gray"
    direction="horizontal"
    className="py-2"
  />
);
