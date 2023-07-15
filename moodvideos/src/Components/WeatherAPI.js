import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const cities = ['Singapore', 'London', 'New York', 'Yerevan']; // Array of cities

    // Function to make API request and update state variables
    const fetchWeatherData = async () => {
      try {
        const dataPromises = cities.map(async (city) => {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0165d8d3494d648e9314a9649095530e`
          );
          return response.data;
        });

        const weatherData = await Promise.all(dataPromises);

        // Update state variable with new data
        setWeatherData(weatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Initial API request
    fetchWeatherData();

    // Interval for updating data every 5 minutes
    const intervalId = setInterval(fetchWeatherData, 300000);

    // Clean up the interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Weather App</h1>
      <div style={{ display: 'flex' }}>
      {weatherData.map((data, index) => (
        <div
        key={index}
        style={{
          marginRight: '20px',
          border: '1px solid black',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
          <h2>{data.name}</h2>
          Temperature: {parseFloat(((data.main.temp - 273.15) * 9) / 5 + 32).toFixed(2)}&deg;F / {parseFloat((data.main.temp -273.15).toFixed(2))}&deg;C
          <p>Description: {data.weather[0].description}</p>
          <img src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} alt="Weather" />
          <br></br>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Weather;
