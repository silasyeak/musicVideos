import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import API_KEY from './config.js';



const apiKEY = API_KEY; // Replace with your YouTube Data API Key

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
          key: apiKEY,
        }
      });
      const fetchedVideos = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));
      setVideos(shuffleArray(fetchedVideos));
      setRandomVideo(fetchedVideos); // set a random video initially
    } catch (error) {
      console.error('Error fetching music videos', error);
    }
  };

  const shuffleArray = (array) => {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
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
