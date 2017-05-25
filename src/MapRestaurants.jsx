import React, { Component } from 'react';
import './MapRestaurants.css';
const burgerIcon = 'ata:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAA1teXP8meAAAAedJREFUOBGdU0tvEmEUPdoGH6VKJAQIjZHYJjNpY1IWDV3qQk27IelCl3SJu24M/6Du/AkuTNomLjDpwqZdQ5u4rmAijpHwUCQgBRFCxHO/GYaXdtGbnLnP786d+50B/i27DPfGILEJuTQWSdAPv3y25nt6/x5QzQJnRSKPvaSBrSOUmP9CrBJKhhskXj3fiIT1OWi3Pf08UE4DDTapGch8MnCSBzb3kWGBLkXTVqU6HH20bLlDyqPqVECbBzS3IbbGJsfUq5dVhmOHb1Usc0x1GuYEEr5yQyXDAaXuyLM/AdD9DeRSLLqpsvaj+c028f10YFuW3SD2+iM03/WJAjsgjf50lZsZGlaWuI0niKNK6xAIUT1wOuH2evE1y1ugvCW4RiBG1IkywS9DCi9kB3HioqLO9nSPSZqFBfQikVECrQTQC8wO4HSYeV03tdqBbNXvBDycf3GRI3Nm7wzw8C7gugYUOHaVOxZpcw3vC0AwCKRJEdnBO07weIncefNB1SDkBxxTQMvcmRm0ntKg3AQqLRU46DOx6LoKn+Zm0Lrr0VOyOVOk6eca2d1WtPbb13gcJb00fZIHcq5O/tZzqsPPDpCku76j3AGRSrwWl8GPOkeafHvhF/CDoMiPNSJyevwX/p9vv+kvksGgDYFMbqsAAAAASUVORK5CYII=';
const burgerSVG = require('./mapSVGs/burger-outline-filled.svg');

class MapRestaurants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: this.props.restaurants,
      displayedInfo: null,
    };

    this.clearInfo = this.clearInfo.bind(this);
  }

  convertLatLongToSVGScale (restaurant) {
    const svgWidth = 272;
    const svgHeight = 792;
    const topLeftLat = 30.413743;
    const topLeftLong = -97.750626;
    const bottomRightLat = 30.310526;
    const bottomRightLong = -97.710549;
    const latDiff = topLeftLat - bottomRightLat;
    const longDiff = Math.abs(topLeftLong - bottomRightLong);

    const newX = Math.abs(topLeftLong - restaurant.longitude) / (longDiff * svgWidth);
    const newY = (topLeftLat - restaurant.latitude) / (latDiff * svgHeight);
    // console.log(newX, newY);
    return [newX, newY];
  }

  displayRestaurantInfo(restaurant) {
    console.log('show info for', restaurant.restaurant_name);
    if (this.state.displayedInfo && this.state.displayedInfo.restaurant.restaurant_name === restaurant.restaurant_name) {
      this.setState({
        displayedInfo: null,
      });
    } else {
      this.setState({
        displayedInfo: { restaurant },
      });
    }
  }

  clearInfo(e) {
    if (this.state.displayedInfo && e.nativeEvent.target.id === 'Map-restaurants') {
      this.setState({
        displayedInfo: null,
      });
    }
  }

  render() {

    return (
      <svg 
        id="Map-restaurants" 
        viewBox="0 0 272 792"
        onClick={e => this.clearInfo(e)}
      >
        {
            this.state.restaurants.map((restaurant, idx) => {
              // let position = this.convertLatLongToSVGScale(restaurant);
              const timing = 'spring 1s ease-in ' + (1 + idx * 0.1) + 's forwards';

              return (
                <g 
                  id={restaurant.restaurant_name}
                  key={restaurant.restaurant_name}
                >
                  <image
                    className="Map-restaurant-location"
                    style={{ visibility: 'hidden', width: 16, height: 16, animation: timing}}
                    x={restaurant.mapX} 
                    y={restaurant.mapY} 
                    width="16"
                    height="16"
                    // ref={ref = this.ref}
                    xlinkHref={burgerSVG}
                    onClick={e => this.displayRestaurantInfo(restaurant, e)}
                  />
                  <circle style={{ visibility: restaurant.infoDisplayed ? 'visible' : 'hidden' }} cx={restaurant.mapX} cy={restaurant.mapY} r={100} />
                </g>
              );
            })
        }

        <path
          style={{ visibility: (this.state.displayedInfo ? 'visible' : 'hidden') }}
          d={`M
            ${(this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapX + 8 : 0)}
            ,
            ${(this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapY : 0)}
            c0,-15 -15,-15 -15,-15 
            l-110,0 
            c0,0 -20,0 -20,-80 
            c0,-80 20,-80 20,-80 
            l250,0 
            c0,0 20,0 20,80 
            c0,80 -20,80 -20,80 
            l-110,0 
            c0,0 -15,0 -15,15 
            Z`}
          id="info-bubble"
          fill="white"
          stroke="black"
        />
        <text
          style={{ visibility: (this.state.displayedInfo ? 'visible' : 'hidden') }}
          x={this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapX - 117 : 0}
          y={this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapY - 160 : 0}
        >
          {this.state.displayedInfo ? this.state.displayedInfo.restaurant.restaurant_name : ''}
        </text>
      </svg>
    );
  }
}

export default MapRestaurants;

// 30.412017, -97.745536
// 30.310526, -97.710549
