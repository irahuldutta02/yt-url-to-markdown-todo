import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "YouTube URL to Markdown Todo",
  description:
    "Convert YouTube videos and playlists to Markdown checklist for tracking your learning progress",
  keywords: [
    "YouTube",
    "Markdown",
    "Todo",
    "Learning",
    "Checklist",
    "Video",
    "Playlist",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#22c55e",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
