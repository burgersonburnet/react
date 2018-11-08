import React, { Component } from 'react';
import './MapRestaurants.css';
import restaurants from './restaurants';

const RESTAURANTS = restaurants;
const burgerSVG = require('./mapSVGs/burger-outline-filled.svg');

const SVG_VIEWBOX_WIDTH = 272;
const SVG_VIEWBOX_HEIGHT = 792;

class MapRestaurants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: RESTAURANTS,
      displayedInfo: null,
    };

    this.clearInfo = this.clearInfo.bind(this);
  }

  convertLatLongToSVGScale (restaurant) {
    const ratio = 792/272;
    const svgWidthRatioHeight = ratio * window.innerWidth;
    const svgHeightRatioHeight = ratio * window.innerHeight;
    // console.log('svgWidthRatioHeight', svgWidthRatioHeight, 'svgHeightRatioHeight', svgHeightRatioHeight)
    // const svgWidthRatioHeight = 272;
    // const svgHeightRatioHeight = 792;
    const topLeftLat = 30.413743;
    const topLeftLong = -97.750626;
    const bottomRightLat = 30.310526;
    const bottomRightLong = -97.710549;
    const latDiff = topLeftLat - bottomRightLat;
    const longDiff = Math.abs(topLeftLong - bottomRightLong);

    const newX = Math.abs(topLeftLong - restaurant.longitude) / (longDiff * svgWidthRatioHeight);
    const newY = (topLeftLat - restaurant.latitude) / (latDiff * svgHeightRatioHeight);
    // console.log(newX, newY);
    return [newX, newY];
  }

  displayRestaurantInfo(restaurant, e) {
    // console.log('show info for', restaurant.restaurant_name);
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

  getBubbleLocation() {
    if (this.state.displayedInfo === null) return;

    const windowRatio = window.innerWidth / window.innerHeight;
    const svgRatio = 272 / 792;

    let svgToWindowUnitDiff;
    if (windowRatio > svgRatio) { // width is bound by the height
      svgToWindowUnitDiff = 1 + ((window.innerHeight - SVG_VIEWBOX_HEIGHT) / SVG_VIEWBOX_HEIGHT);
    } else if (svgRatio > windowRatio) { // width is bounding
      svgToWindowUnitDiff = (window.innerWidth - SVG_VIEWBOX_WIDTH) / SVG_VIEWBOX_WIDTH;
    } else {
      svgToWindowUnitDiff = 1
    }

    let leftOffset = 0;
    if (windowRatio >= svgRatio) {
      const extraPixels = (window.innerWidth - (272 * svgToWindowUnitDiff)) / 2;
      const distFromEdge = extraPixels + (this.state.displayedInfo.restaurant.mapX * svgToWindowUnitDiff) + 8;
      const bubbleWidth = 135 * svgToWindowUnitDiff;
      if (bubbleWidth > distFromEdge) {
        leftOffset = bubbleWidth - distFromEdge;
      } else if (bubbleWidth > window.innerWidth - distFromEdge) {
        leftOffset = bubbleWidth - (window.innerWidth - distFromEdge);
      }
    }

    if (leftOffset !== 0) {
      leftOffset =+ 5;
    }

    let pathDescriptors;

    if (this.state.displayedInfo.restaurant.mapY > 175) {
      pathDescriptors = `M ${this.state.displayedInfo.restaurant.mapX + 8},
                ${this.state.displayedInfo.restaurant.mapY}
                c0,-15 -15,-15 -15,-15
                l-${100 - leftOffset},0 
                c0,0 -20,0 -20,-80 
                c0,-80 20,-80 20,-80 
                l230,0 
                c0,0 20,0 20,80 
                c0,80 -20,80 -20,80 
                l-${100 + leftOffset},0 
                c0,0 -15,0 -15,15 
                Z`;
    } else {
      pathDescriptors = `M ${(this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapX + 8 : 0)},`
      pathDescriptors += `${(this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapY + 16 : 0)} `
      pathDescriptors += 
        `c0,15 -15,15 -15,15 
        l-${100 + leftOffset},0
        c0,0 -20,0 -20,80 
        c0,80 20,80 20,80 
        l230,0 
        c0,0 20,0 20,-80 
        c0,-80 -20,-80 -20,-80
        l-${100 - leftOffset},0 
        c0,0 -15,0 -15,-15
        Z`;
    }
    
    return pathDescriptors;
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
        <g>
        <path
          className="Map-popup"
          d={ this.getBubbleLocation() }
          id="info-bubble"
          fill="white"
          stroke="black"
          strokeWidth="1"
        />
        </g>
        <text
          style={{ visibility: (this.state.displayedInfo ? 'visible' : 'hidden') }}
          x={this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapX - 107 : 0}
          y={this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapY + (this.state.displayedInfo.restaurant.mapY > 175 ? -160 : 185) : 0}
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
