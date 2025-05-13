import { google } from "googleapis";
import {
  convertISOToSeconds,
  extractPlaylistId,
  extractVideoId,
  formatDuration,
  formatDurationFromSeconds,
} from "../../utils/youtubeHelpers";

// Initialize the YouTube API client
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get("url");
    const type = searchParams.get("type"); // 'video' or 'playlist'

    if (!videoUrl) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    if (type === "video") {
      // Handle single video
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        return Response.json({ error: "Invalid YouTube URL" }, { status: 400 });
      }

      const result = await getVideoData(videoId);
      return Response.json(result);
    } else if (type === "playlist") {
      // Handle playlist
      const playlistId = extractPlaylistId(videoUrl);
      if (!playlistId) {
        return Response.json(
          { error: "Invalid YouTube playlist URL" },
          { status: 400 }
        );
      }

      const result = await getPlaylistData(playlistId);
      return Response.json(result);
    } else {
      return Response.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Function to get video data from YouTube API
async function getVideoData(videoId) {
  try {
    // Get video details
    const videoResponse = await youtube.videos.list({
      part: "snippet,contentDetails",
      id: videoId,
    });

    const video = videoResponse.data.items[0];
    if (!video) {
      throw new Error("Video not found");
    }

    // Get channel details
    const channelId = video.snippet.channelId;
    const channelResponse = await youtube.channels.list({
      part: "snippet",
      id: channelId,
    });

    const channel = channelResponse.data.items[0];
    if (!channel) {
      throw new Error("Channel not found");
    }

    // Format the result
    const result = {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      channelTitle: channel.snippet.title,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      duration: formatDuration(video.contentDetails.duration),
    };

    return result;
  } catch (error) {
    console.error("Error fetching video data:", error);
    throw error;
  }
}

// Function to get playlist data from YouTube API
async function getPlaylistData(playlistId) {
  try {
    // Get playlist details
    const playlistResponse = await youtube.playlists.list({
      part: "snippet,contentDetails",
      id: playlistId,
    });

    const playlist = playlistResponse.data.items[0];
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    // Get channel details
    const channelId = playlist.snippet.channelId;
    const channelResponse = await youtube.channels.list({
      part: "snippet",
      id: channelId,
    });

    const channel = channelResponse.data.items[0];
    if (!channel) {
      throw new Error("Channel not found");
    }

    // Get playlist items (videos)
    const videos = [];
    let nextPageToken = null;
    let totalDurationSeconds = 0;

    do {
      const playlistItemsResponse = await youtube.playlistItems.list({
        part: "snippet,contentDetails",
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      });

      // Get details for each video in the playlist
      const videoIds = playlistItemsResponse.data.items.map(
        (item) => item.contentDetails.videoId
      );

      const videosResponse = await youtube.videos.list({
        part: "snippet,contentDetails",
        id: videoIds.join(","),
      });

      // Map playlist items with video details
      for (let i = 0; i < playlistItemsResponse.data.items.length; i++) {
        const playlistItem = playlistItemsResponse.data.items[i];
        const videoId = playlistItem.contentDetails.videoId;

        // Find corresponding video details
        const videoDetails = videosResponse.data.items.find(
          (video) => video.id === videoId
        );

        if (videoDetails) {
          const durationISO = videoDetails.contentDetails.duration;
          const durationFormatted = formatDuration(durationISO);
          const durationSeconds = convertISOToSeconds(durationISO);
          totalDurationSeconds += durationSeconds;

          videos.push({
            title: videoDetails.snippet.title,
            url: `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}&index=${videos.length}`,
            embedUrl: `https://www.youtube.com/embed/${videoId}?list=${playlistId}&index=${videos.length}`,
            duration: durationFormatted,
            position: videos.length + 1, // 1-based index for display
          });
        }
      }

      nextPageToken = playlistItemsResponse.data.nextPageToken;
    } while (nextPageToken);

    // Format the result
    const result = {
      title: playlist.snippet.title,
      url: `https://youtube.com/playlist?list=${playlistId}`,
      channelTitle: channel.snippet.title,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      videos: videos,
      totalDuration: formatDurationFromSeconds(totalDurationSeconds),
      totalVideos: videos.length,
    };

    return result;
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    throw error;
  }
}
