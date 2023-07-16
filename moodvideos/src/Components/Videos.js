import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';

const API_KEY = 'AIzaSyDfyeaxxWukn8xvA16XQFkKLTABlCu-Tz8'; // Replace with your YouTube Data API Key

const Videos = () => {
  const [videoContainers, setVideoContainers] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchMusicVideos();
  }, []);

  const fetchMusicVideos = async () => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults: 10,
          q: 'music',
          type: 'video',
          videoCategoryId: '10',
          key: API_KEY,
        }
      });
      const fetchedVideos = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));
      setVideos(fetchedVideos);
      setRandomVideo(fetchedVideos); // set a random video initially
    } catch (error) {
      console.error('Error fetching music videos', error);
    }
  };

  const setRandomVideo = (videos) => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setVideoContainers(videos[randomIndex].id);
  };

  const embedVideo = (id) => {
    setVideoContainers(id);
  };

  return (
    <div>
      

      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Select a video
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {videos.map((video, index) => (
            <Dropdown.Item key={index} onClick={() => embedVideo(video.id)}>
              <img
                src={video.thumbnail}
                alt={video.title}
                width="50px"
                height="auto"
              />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {videoContainers && <YouTube videoId={videoContainers} />}
    </div>
  );
};

export default Videos;

