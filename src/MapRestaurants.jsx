import React, { Component } from 'react';
import './MapRestaurants.css';
import restaurants from './restaurants';
import DetailBubble from './DetailBubble';

const RESTAURANTS = restaurants;
const burgerSVG = require('./mapSVGs/burger-outline-filled.svg');

class MapRestaurants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurants: RESTAURANTS,
      displayedInfo: null,
    };

    this.clearInfo = this.clearInfo.bind(this);
  }

  displayRestaurantInfo(restaurant, e) {
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

  // clears bubble on map click
  clearInfo(e) {
    if (this.state.displayedInfo && e.nativeEvent.target.id === 'Map-restaurants') {
      this.setState({
        displayedInfo: null,
      });
    }
  }

  restaurantBubble() {
    return <DetailBubble
      visible={this.state.displayedInfo}
      x={this.state.displayedInfo.restaurant.mapX}
      y={this.state.displayedInfo.restaurant.mapY}
      restaurant={this.state.displayedInfo.restaurant}
    />
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
              const timing = `spring 1s ease-in ${1 + idx * 0.1}s forwards`;

              return (
                <g 
                  id={restaurant.restaurant_name}
                  key={restaurant.restaurant_name}
                >
                  <image
                    className="map-restaurant-location"
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
        { this.state.displayedInfo ? this.restaurantBubble() : '' }
      </svg>
    );
  }
}

export default MapRestaurants;

// 30.412017, -97.745536
// 30.310526, -97.710549
