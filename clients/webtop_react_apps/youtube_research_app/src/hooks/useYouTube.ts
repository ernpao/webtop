import { useState, useEffect } from 'react';

// Individual thumbnail details
export interface YouTubeThumbnail {
    url: string;
    width: number;
    height: number;
}

// Collection of thumbnails for a result
export interface YouTubeThumbnails {
    default: YouTubeThumbnail;
    medium: YouTubeThumbnail;
    high: YouTubeThumbnail;
    // You might want to add standard and maxres as optional if your request includes them
    // standard?: YouTubeThumbnail;
    // maxres?: YouTubeThumbnail;
}

// Snippet containing metadata about the search result
export interface YouTubeSnippet {
    publishedAt: string; // ISO 8601 date string
    channelId: string;
    title: string;
    description: string;
    thumbnails: YouTubeThumbnails;
    channelTitle: string;
    liveBroadcastContent: "none" | "live" | "upcoming" | string; // 'none' is common
    publishTime: string; // ISO 8601 date string
}

// Discriminated union for the ID object based on result type
// This allows TypeScript to know which ID (videoId, playlistId, channelId)
// is available based on the 'kind' property.
export type YouTubeSearchResultId =
    | {
        kind: "youtube#video";
        videoId: string;
    }
    | {
        kind: "youtube#playlist";
        playlistId: string;
    }
    | {
        kind: "youtube#channel";
        channelId: string; // Added for completeness, though not in your example
    };

// Represents a single item in the search results array
export interface YouTubeSearchResult {
    kind: "youtube#searchResult";
    etag: string;
    id: YouTubeSearchResultId; // Uses the discriminated union type
    snippet: YouTubeSnippet;
}

// Information about pagination
export interface YouTubePageInfo {
    totalResults: number;
    resultsPerPage: number;
}

// The overall structure of the YouTube Search API List Response
export interface YouTubeSearchListResponse {
    kind: "youtube#searchListResponse";
    etag: string;
    nextPageToken?: string; // Optional: Not present on the last page of results
    prevPageToken?: string; // Optional: Not present on the last page of results
    regionCode: string;
    pageInfo: YouTubePageInfo;
    items: YouTubeSearchResult[]; // Array of individual search results
}

export default function useYouTube() {

    const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
    const API_ENDPOINT = "https://www.googleapis.com/youtube/v3/search"

    const [isPending, setIsPending] = useState(false)
    const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined)
    const [prevPageToken, setPrevPageToken] = useState<string | undefined>(undefined)
    const [results, setResults] = useState<YouTubeSearchResult[]>([])

    const searchYouTube = async function (query: string): Promise<YouTubeSearchListResponse | null> {
        if (query) {

            setIsPending(true);
            try {
                const response = await fetch(`${API_ENDPOINT}?q=${query}&part=snippet&key=${API_KEY}&maxResults=100&type=video`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: YouTubeSearchListResponse = await response.json();
                setResults(data.items)
                setNextPageToken(data.nextPageToken)
                setPrevPageToken(data.prevPageToken)
                return data;

            } catch (error) {

                console.error("Failed to fetch YouTube search results:", error);
                return null;

            } finally {
                setIsPending(false);
            }
        }

        return null;

    }


    return { searchYouTube, isPending, results, nextPageToken, prevPageToken }

}