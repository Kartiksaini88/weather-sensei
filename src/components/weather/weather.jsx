import axios from "axios";
import React from "react";
import "./weather.css";
import { useEffect } from "react";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import sun from "../images/sunny.png";
import rain from "../images/rain.png";
import haze from "../images/haze.png";
import cloud from "../images/cloud.png";
import { Line } from "react-chartjs-2";
import loadingAni from "./Loading.json";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import Lottie from "react-lottie";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Weather = () => {
  const loadingoption = {
    loop: true,
    autoplay: true,
    animationData: loadingAni,
    rendererSettings: {
      preserverAspectRatio: "xMidYMid slice",
    },
  };
  const data = {
    labels: ["9am", "10am", "11am", "12pm", "1pm", "2pm"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          Math.random(9),
          Math.random(3),
          Math.random(2),
          Math.random(6),
          Math.random(10),
          Math.random(5),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        tension: 0.1,
        fill: false,
        borderWidth: 1,
      },
    ],
  };
  const option = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const [city, setcity] = useState("Mumbai");
  const [isload, setisload] = useState(false);

  const [weatherData, setweatherdata] = useState([]);

  console.log(weatherData);
  const geo = (city) => {
    const geoApi = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=d23026f7cb9799d0df950f83081d05ec`;
    axios
      .get(geoApi)
      .then((res) => {
        getweather(res.data[0].lat, res.data[0].lon);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getweather = (lat, lon) => {
    setisload(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d23026f7cb9799d0df950f83081d05ec&units=metric`
      )
      .then((res) => {
        setweatherdata(res.data);

        const { humidity, pressure, temp_max, temp_min } = res.data.main;
        const { description, icon, main } = res.data.weather[0];
        const weatherobj = [
          {
            humidity,
            pressure,
            temp_max,
            temp_min,
            name: city,
            description,
            icon,
            main,
          },
        ];
        setweatherdata(weatherobj);
        setisload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const requestpermission = () => {
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") {
        geo("Mumbai");
      }else{
        return;
      }
    });
  };

  useEffect(() => {
    requestpermission();
  }, []);
  
  return (
    <div>
      <div className="search-box">
        <input
          type="search"
          value={city}
          className="search-input"
          onChange={(e) => {
            setcity(e.target.value);
          }}
          name=""
          id=""
        />

        <button className="search-btn" onClick={geo}>
          <BiSearch></BiSearch>
        </button>
      </div>
      {isload && (
        <Lottie options={loadingoption} height={300} width={300}></Lottie>
      )}
      {weatherData.length != 0 ? (
        <div className="show-weather">
          <div className="temp">
            <div className="degree">
              {" "}
              {weatherData[0].name} {Math.round(weatherData[0].temp_max)} °C
              <p className="min-max">
                Max-{Math.round(weatherData[0].temp_min)} °C
              </p>
              <p className="min-max">
                Min-{Math.round(weatherData[0].temp_min)} °C
              </p>
            </div>
            <div className="logo">
              <img
                className="logo"
                src={
                  weatherData[0].main == "Haze"
                    ? haze
                    : weatherData[0].main == "Rain"
                    ? rain
                    : weatherData[0].main == "Clouds"
                    ? cloud
                    : sun
                }
                alt=""
              />
              <p className="des">{weatherData[0].main}</p>
            </div>
          </div>
        </div>
      ) : null}
      {weatherData.length !== 0 ? (
        <div className="graph">
          <Line data={data} options={option}></Line>
        </div>
      ) : null}
      {weatherData.length != 0 ? (
        <div className="humi-pre">
          <div>
            <p>Humidity</p>
            <p className="min-max2">{weatherData[0].humidity} %</p>
          </div>
          <div>
            <p>Pressure</p>
            <p className="min-max2">{weatherData[0].pressure} hpa</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Weather;
