import React, { useState } from 'react';
import './Videos.css';


const Videos = () => {
  const [counter, setCounter] = useState(0);
  const [videoContainers, setVideoContainers] = useState([null, null]);
  const videos = [
    "https://www.youtube.com/embed/fhdX3Wcxwas",
    "https://www.youtube.com/embed/ChBg4aowzX8",
    "https://www.youtube.com/embed/L_LUpnjgPso",
    "https://www.youtube.com/embed/gyvzdEXgNJw",
    "https://www.youtube.com/embed/n_Dv4JMiwK8",
    "https://www.youtube.com/embed/NJuSStkIZBg",
    "https://www.youtube.com/embed/i7Wp1UNaffU",
    "https://www.youtube.com/embed/G52dUQLxPzg",
    "https://www.youtube.com/embed/4NrpprUAa2U",
    "https://www.youtube.com/embed/gKBkS-dv4lg"
  ];

  const embedVideo = (index) => {
    const videoSrc = videos[index];
    const newVideoContainers = [...videoContainers];
    newVideoContainers[counter % 2] = videoSrc;
    setVideoContainers(newVideoContainers);
    setCounter(counter + 1);
  };



  return (
    <div>
        <div id="video-container-wrapper">
            {videoContainers.map((src, index) => src && (
                <iframe key={index} width="560" height="315" src={src} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            ))}
        </div>

        <div className="video-wrapper">
        {videos.map((src, index) => (
          <div className="video-thumbnail" key={index}>
            <img
              src={`https://img.youtube.com/vi/${src.split("/")[4]}/mqdefault.jpg`}
              alt="Video thumbnail"
              onClick={() => embedVideo(index)}
            />
            
          </div>
        ))}
      </div>

    </div>
  );
};

export default Videos;
