import React, { useState } from "react";

function FinalExam() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = "PfQNUHkkVam1BCRZGpJjEllSmAS2rpxE";

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (city.trim() === "") {
      setError("Please enter a city name.");
      return;
    }
    try {
      const locationData = await getWeather(city);
      if (locationData) {
        const locationKey = locationData[0].Key;
        await Promise.all([
          fetchWeatherData(locationKey),
          fetchDailyForecast(locationKey),
          fetchHourlyForecast(locationKey),
        ]);
      } else {
        setError("City not found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data.");
    }
  };

  const getWeather = async (city) => {
    const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;
    const response = await fetch(locationUrl);
    const data = await response.json();
    return data;
  };

  const fetchWeatherData = async (locationKey) => {
    const currentWeatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;
    const response = await fetch(currentWeatherUrl);
    const data = await response.json();
    if (data && data.length > 0) {
      setWeatherData(data[0]);
      setError(null);
    } else {
      setError("No weather data available.");
    }
  };

  const fetchDailyForecast = async (locationKey) => {
    const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;
    const response = await fetch(dailyForecastUrl);
    const data = await response.json();
    if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
      setDailyForecast(data.DailyForecasts);
      setError(null);
    } else {
      setError("No daily forecast data available.");
    }
  };

  const fetchHourlyForecast = async (locationKey) => {
    const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}`;
    const response = await fetch(hourlyForecastUrl);
    const data = await response.json();
    if (data && data.length > 0) {
      setHourlyForecast(data);
      setError(null);
    } else {
      setError("No hourly forecast data available.");
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="cityInput"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p>{error}</p>}
      {weatherData && (
        <div>
          <h2>Current Weather</h2>
          <p>Temperature: {weatherData.Temperature.Metric.Value}°C</p>
          <p>Weather: {weatherData.WeatherText}</p>
        </div>
      )}
      {dailyForecast && (
        <div>
          <h2>5 Days Daily Forecast</h2>
          {dailyForecast.map((forecast, index) => (
            <div key={index}>
              <p>Date: {new Date(forecast.Date).toDateString()}</p>
              <p>Temperature: {forecast.Temperature.Maximum.Value}°C</p>
              <p>Weather: {forecast.Day.IconPhrase}</p>
            </div>
          ))}
        </div>
      )}
      {hourlyForecast && (
        <div>
          <h2>1 Hourly Forecast</h2>
          {hourlyForecast.map((forecast, index) => (
            <div key={index}>
              <p>Date: {new Date(forecast.DateTime).toLocaleString()}</p>
              <p>Temperature: {forecast.Temperature.Value}°C</p>
              <p>Weather: {forecast.IconPhrase}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FinalExam;
