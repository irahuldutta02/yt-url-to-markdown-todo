import { FaExclamationTriangle } from "react-icons/fa";

const ErrorDisplay = ({ message }) => {
  if (!message) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow-md border border-red-200 dark:border-red-800">
      <div className="flex items-start">
        <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl mr-3 mt-0.5" />
        <div>
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-red-700 dark:text-red-300">
            {message || "An unexpected error occurred. Please try again."}
          </p>
          <div className="mt-4">
            <p className="text-sm text-red-600 dark:text-red-400">
              <strong>Possible solutions:</strong>
            </p>
            <ul className="list-disc pl-5 mt-1 text-sm text-red-600 dark:text-red-400 space-y-1">
              <li>Check if the YouTube URL is valid and accessible</li>
              <li>
                Make sure you&apos;ve selected the correct content type
                (video/playlist)
              </li>
              <li>Ensure your API key has the YouTube Data API enabled</li>
              <li>Wait a moment and try again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
