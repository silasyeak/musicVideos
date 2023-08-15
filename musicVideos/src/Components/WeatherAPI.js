import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./WeatherAPI.css";
import { weatherKey } from './config';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState("Current Location");

  useEffect(() => {
    // Function to get user's current location
    const fetchCurrentLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          fetchLocationName(latitude, longitude);
        });
      }
    };

    // Function to fetch location name using reverse geocoding
    const fetchLocationName = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}`
        );
        setLocationName(response.data.name);
      } catch (error) {
        console.error('Error fetching location name:', error);
      }
    };

    // Function to make API request and update state variables
    const fetchWeatherData = async () => {
      if (currentLocation) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&appid=${weatherKey}`
          );
          const weatherData = [response.data];
          setWeatherData(weatherData);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      }
    };

    // Get current location and location name
    fetchCurrentLocation();

    // Initial API request
    fetchWeatherData();

    // Interval for updating data 
    const intervalId = setInterval(fetchWeatherData, 300000);

    // Clean up the interval
    return () => clearInterval(intervalId);
  }, [currentLocation]);

  if (!currentLocation) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {weatherData.map((data, index) => (
        <div
          key={index}
          style={{
            border: '1px solid black',
            padding: '10px',
            borderRadius: '15px',
            flex: '1',
            margin: '10px',
            textAlign: 'center',
          }}
        >
          <h2>{locationName}</h2>
          Temperature: {parseFloat(((data.main.temp - 273.15) * 9) / 5 + 32).toFixed(2)}&deg;F / {parseFloat((data.main.temp -273.15).toFixed(2))}&deg;C
          <p>Description: {data.weather[0].description}</p>
          <img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} alt="Weather" />
        </div>
      ))}
    </div>
  );
  
};

export default Weather;
