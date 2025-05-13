import { useRef } from "react";
import toast from "react-hot-toast";
import { FaCheckSquare, FaCopy } from "react-icons/fa";

const ResultDisplay = ({ result, type }) => {
  const textAreaRef = useRef(null); // Generate markdown for a single video
  const generateVideoMarkdown = (data) => {
    // Get current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const lastUpdated = `${formattedDate} ${formattedTime}`;

    let markdown = `## [${data.title}](${data.url}) - [${data.channelTitle}](${data.channelUrl})\n\n`;
    markdown += `- **Last Updated at : ${lastUpdated}**\n\n`;
    markdown += `- [ ]  **01. [${data.title}](${data.embedUrl}) (${data.duration})**`;

    return markdown;
  };

  // Generate markdown for a playlist
  const generatePlaylistMarkdown = (data) => {
    // Get current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const lastUpdated = `${formattedDate} ${formattedTime}`;

    let markdown = `## [${data.title}](${data.url}) - [${data.channelTitle}](${data.channelUrl})\n\n`;
    markdown += `- **Total Playlist Duration: ${data.totalDuration}**\n`;
    markdown += `- **Last Updated at : ${lastUpdated}**\n`;
    markdown += `- **Total Items** - ${data.videos.length}\n`;

    data.videos.forEach((video, index) => {
      const paddedIndex = (index + 1).toString().padStart(2, "0");
      markdown += `- [ ]  **${paddedIndex}. [${video.title}](${video.embedUrl}) (${video.duration})**\n`;
    });

    return markdown;
  };

  // Generate the appropriate markdown based on the result type
  const generateMarkdown = () => {
    if (!result) return "";

    if (type === "video") {
      return generateVideoMarkdown(result);
    } else if (type === "playlist") {
      return generatePlaylistMarkdown(result);
    }

    return "";
  };

  const markdownText = generateMarkdown();
  const handleCopyClick = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      navigator.clipboard
        .writeText(textAreaRef.current.value)
        .then(() => {
          toast.success("Markdown copied to clipboard!", {
            icon: "📋",
          });
        })
        .catch(() => {
          toast.error("Failed to copy. Please try again.");
        });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaCheckSquare className="text-green-500 text-xl mr-2" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Markdown Result
          </h2>
        </div>
        <button
          onClick={handleCopyClick}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          <FaCopy className="mr-1" />
          Copy
        </button>
      </div>{" "}
      <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 min-h-[200px] max-h-[600px] overflow-y-auto">
          {markdownText}
        </pre>
      </div>
      <textarea
        ref={textAreaRef}
        value={markdownText}
        readOnly
        className="hidden"
        aria-hidden="true"
      />
      <div className="mt-4 flex justify-between items-center">
        <div>
          {type === "playlist" && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <strong>{result?.videos?.length || 0}</strong> videos |
              <strong> {result?.totalDuration}</strong> total duration
            </p>
          )}
        </div>
        <a
          href={result?.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Open on YouTube
        </a>
      </div>
    </div>
  );
};

export default ResultDisplay;
