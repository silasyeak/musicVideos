import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { youtubeAPI } from './config.js';
import { accessToken } from './config2.js';
import he from 'he';



const Videos = () => {
  const [videoContainers, setVideoContainers] = useState(null);
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('Alessia Cara');
  const [artists, setArtists] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);


  useEffect(() => {
    fetchMusicVideos();
    fetchArtists(); // Fetch artists initially
  }, [searchQuery]);

  const fetchMusicVideos = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 5, //for testing, change this up later
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

  const selectArtist = (artistName) => {
    setSearchQuery(artistName);
  };

  const fetchArtists = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: searchQuery,
          type: 'artist',
          limit: 5, // for testing reasons
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedArtists = response.data.artists.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
      }));

      // Get the first artist from the search results (assuming there's only one artist with that name)
      const mainArtist = fetchedArtists[0];

      // Fetch related artists for the main artist
      const relatedArtistsResponse = await axios.get(`https://api.spotify.com/v1/artists/${mainArtist.id}/related-artists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const fetchedRelatedArtists = relatedArtistsResponse.data.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      }));

      // Set the related artists state
      setRelatedArtists(fetchedRelatedArtists);
      setArtists(fetchedArtists); // Move this line here to set the main artists state after fetching related artists
    } catch (error) {
      console.error('Error fetching artists', error);
    }
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
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <Dropdown style={{ paddingLeft: "10px" }}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Select a video
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {videos.map((video, index) => (
                    <Dropdown.Item key={index} style={{ display: "flex" }} onClick={() => embedVideo(video.id)}>
                      <img src={video.thumbnail} alt={video.title} width="50px" height="auto" />
                      <div>{he.decode(video.title)}</div>
                    </Dropdown.Item>
                  ))}
                  {relatedArtists.map((artist, index) => (
                    <Dropdown.Item key={index} style={{ display: "flex" }} onClick={() => selectArtist(artist.name)}>
                      <div>{artist.name}</div>
                    </Dropdown.Item>
                  ))}

                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch} style={{ display: "flex", width: "400px", margin: "20px" }}>
            <input className="form-control mr-sm-2" type="search" placeholder="Search your favorite artist!" aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
        <div>
          <button type="button" class="btn btn-primary">
            Project for a later date
          </button>
        </div>

      </nav>
      <div>{videoContainers && <YouTube videoId={videoContainers} opts={opts} />}</div>
    </div>
  );
};

export default Videos;