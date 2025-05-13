import { FaGithub, FaInfo } from "react-icons/fa";

const Instructions = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <FaInfo className="text-blue-500 text-xl mr-2" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          How to Use
        </h2>
      </div>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="font-semibold mb-1">For Single Videos:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select &quot;Single Video&quot; option</li>
            <li>
              Paste a YouTube video URL.
            </li>
            <li>Click &quot;Generate Markdown&quot;</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-1">For Playlists:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Select &quot;Playlist&quot; option</li>
            <li>
              Paste a YouTube playlist URL.
            </li>
            <li>Click &quot;Generate Markdown&quot;</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Copy and Use:</h3>
          <p>
            The generated markdown is ready to use in your Markdown files for
            tracking your learning progress!
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <a
          href="https://github.com/irahuldutta02/yt-url-to-markdown-todo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaGithub className="mr-1" />
          View on GitHub
        </a>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          © 2025 YT URL to Markdown Todo
        </span>
      </div>
    </div>
  );
};

export default Instructions;
