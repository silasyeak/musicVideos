import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { youtubeAPI} from './config.js';
import { spotifyKey } from './config.js';
import he from 'he'; 


const Videos = () => {
  const [videoContainers, setVideoContainers] = useState(null);
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('Porter Robinson');

  useEffect(() => {
    fetchMusicVideos();
  }, []);

  const fetchMusicVideos = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 4,
          q: searchQuery, // Use the user's search query here
          type: 'video',
          videoCategoryId: '10',
          key: youtubeAPI,
        },
      });
      
      const fetchedVideos = response.data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));
      console.log(fetchedVideos)
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

  const opts = {
    height: '1000',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchMusicVideos();
  };

  return (

    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-dark">
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown">
              <Dropdown style={{paddingLeft:"10px"}}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Select a video
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {videos.map((video, index) => (
                    <Dropdown.Item key={index} style={{display:"flex"}} onClick={() => embedVideo(video.id)}>
                      <img src={video.thumbnail} alt={video.title} width="50px" height="auto" />
                      <div>{he.decode(video.title)}</div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </li>

          </ul>
          <form class="form-inline my-2 my-lg-0" onSubmit={handleSearch} style={{ display: "flex", width: "400px", margin: "20px" }}>
            <input class="form-control mr-sm-2" type="search" placeholder="Search your favorite artist!" aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>

      <div>{videoContainers && <YouTube videoId={videoContainers} opts={opts} />}</div>
    </div>
  );
};

export default Videos;
