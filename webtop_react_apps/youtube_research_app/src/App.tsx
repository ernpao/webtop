
import React, { useState, useEffect, useRef } from 'react';
import useYouTube from './hooks/useYouTube';

export default function App() {

  const { searchYouTube, isPending, results, nextPageToken, prevPageToken } = useYouTube()

  useEffect(() => {
    searchYouTube("Animated shorts")
  }, [])

  return (
    <div>
      Hello World!
      {
        isPending ? <div>Loading...</div> : results.map((r, index) => <div>
          <div>  {index} </div>
          <div>  {r.snippet.title} </div>
          <img src={r.snippet.thumbnails.default.url} />
        </div>)
      }
    </div>
  );
}
