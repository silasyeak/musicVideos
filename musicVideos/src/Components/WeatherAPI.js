import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./WeatherAPI.css";
import { weatherKey } from './config';
import 'bootstrap/dist/css/bootstrap.min.css';
import {CardGroup, Card} from 'react-bootstrap';

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
    <div>
      <CardGroup>
        {/* Temperature and Description Cards */}
        {weatherData.map((data, index) => (
          <Card bg = 'dark' text={'dark' === 'light' ? 'dark' : 'white'} key={index} border={'dark' === 'light' ? 'dark' : 'white'} style={{ width: '18rem', marginBottom: '20px'}}>
            <Card.Header><h2>{locationName}</h2></Card.Header>
            <Card.Body>
              <Card.Title>
                <h4>Temperature: {parseFloat(((data.main.temp - 273.15) * 9) / 5 + 32).toFixed(2)}&deg;F /{' '}
                {parseFloat((data.main.temp - 273.15).toFixed(2))}&deg;C</h4>
                
              </Card.Title>
              <Card.Text>
                <h4>Description: {data.weather[0].description}</h4>
                <img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} alt="Weather" />
              </Card.Text>
            </Card.Body>
          </Card>
        ))}

        {/* Additional Weather Information Cards */}
        {weatherData.map((data, index) => (
          <Card bg = 'dark' text={'dark' === 'light' ? 'dark' : 'white'} key={index} border={'dark' === 'light' ? 'dark' : 'white'} style={{ width: '18rem', marginBottom: '20px'}}>
            
            <Card.Body>
              <Card.Text>
              <h4>Sunrise: {new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>
              <h4>Sunset: {new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h4>

                <h4>Wind Speed: {data.wind.speed} m/s</h4>
                <h4>Cloudiness: {data.clouds.all}%</h4>
                <h4>Coordinates: {data.coord.lat}, {data.coord.lon}</h4>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      
      </CardGroup>
    </div>
  );
}

export default Weather;
