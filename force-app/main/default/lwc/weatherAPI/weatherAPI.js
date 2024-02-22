import { LightningElement } from "lwc";
import getWeather from "@salesforce/apex/WeatherAPI.getWeather";

export default class WeatherAPI extends LightningElement {
  city;
  condition;
  imageUrl;
  message;

  handleOnChange(event) {
    this.city = event.target.value;
  }

  buttonClick() {
    getWeather({ city: this.city })
      .then((response) => {
        let parsedData = JSON.parse(response);
        let tomorrowDate = this.tomorrowsDate();
        let tomorrowData = this.findForecastForDate(parsedData, tomorrowDate);
        this.message = "Tomorrow's  forecast for " + this.city + ": ";
        this.imageUrl = tomorrowData.day.condition.icon;
        this.condition = tomorrowData.day.condition.text;
      })
      .catch((err) => {
        this.message = "No matching location found.";
        this.imageUrl = "";
        this.condition = "";
        console.log(err.message);
      });
  }

  tomorrowsDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const tomorrow = new Date(year, month - 1, day + 1);
    const formattedTomorrow =
      tomorrow.getFullYear() +
      "-" +
      ("0" + (tomorrow.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + tomorrow.getDate()).slice(-2);

    return formattedTomorrow;
  }

  findForecastForDate(forecastData, targetDate) {
    console.log(forecastData);
    const forecastDays = forecastData.forecast.forecastday;
    for (let i = 0; i < forecastDays.length; i++) {
      const forecast = forecastDays[i];
      if (forecast.date === targetDate) {
        return forecast;
      }
    }
    return null; // Return null if forecast for the target date is not found
  }
}
