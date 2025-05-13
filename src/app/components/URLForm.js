import { useState } from "react";
import toast from "react-hot-toast";
import { FaLink, FaSpinner, FaYoutube } from "react-icons/fa";

const URLForm = ({ onResult, onError }) => {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("playlist"); // 'video' or 'playlist'
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (onError) {
      onError(""); // Clear parent component error
    }
    if (!url.trim()) {
      setFormError("Please enter a YouTube URL");
      toast.error("Please enter a YouTube URL");
      return;
    }

    // Simple URL validation
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      setFormError("Please enter a valid YouTube URL");
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/youtube?url=${encodeURIComponent(url)}&type=${type}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      } // Pass the result up to the parent component
      onResult({
        data,
        type,
      });

      // Show success toast
      toast.success(
        `${
          type === "video" ? "Video" : "Playlist"
        } markdown generated successfully!`,
        {
          icon: "✅",
        }
      );
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.message || "An error occurred. Please try again.";
      setFormError(errorMessage);

      // Show toast error
      toast.error(errorMessage);

      // Pass error to parent component if callback exists
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <FaYoutube className="text-red-600 text-4xl mr-3" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          YouTube to Markdown Todo
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          {" "}
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="playlist"
                checked={type === "playlist"}
                onChange={(e) => setType(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">Playlist</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="video"
                checked={type === "video"}
                onChange={(e) => setType(e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Single Video
              </span>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLink className="text-gray-500" />
            </div>
            <input
              type="url"
              id="youtubeUrl"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={`Enter YouTube ${
                type === "video" ? "video" : "playlist"
              } URL`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          {formError && (
            <p className="text-red-500 text-sm mt-2">{formError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out flex justify-center items-center"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Generate Markdown"
          )}
        </button>
      </form>
    </div>
  );
};

export default URLForm;
