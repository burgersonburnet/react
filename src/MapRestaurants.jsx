import React, { Component } from 'react';
import './MapRestaurants.css';

class MapRestaurants extends Component {
  constructor(props) {
    super(props);
    console.log('received', props.restaurants.length, 'restaurants');
  }

  convertLatLongToSVGScale(restaurant) {
    let svgWidth = 272;
    let svgHeight = 792;
    let topLeftLat = 30.412017;
    let topLeftLong =  -97.745536;
    let bottomRightLat = 30.310526;
    let bottomRightLong = -97.710549;
    let latDiff = topLeftLat - bottomRightLat;
    let longDiff = Math.abs(topLeftLong - bottomRightLong);

    let newX = Math.abs(topLeftLong - restaurant.longitude) / longDiff * svgWidth;
    let newY = (topLeftLat - restaurant.latitude) / latDiff * svgHeight;
    console.log(newX, newY);
    return [newX + 15, newY];
  }

  render() {
    return (
        <svg id="Map-restaurants" viewBox="0 0 272 792">
        {
            this.props.restaurants.map((restaurant, idx) => {
                let position = this.convertLatLongToSVGScale(restaurant);
                return (
                    <circle 
                        className='Map-restaurant-location'
                        cx={position[0]}
                        cy={position[1]}
                        r="5"
                        fill="green"
                        strokeWidth="1"
                        stroke="#000000"
                        key={idx}
                        // ref={ref = this.ref}
                        onClick={(rel) => console.log('click', restaurant.restaurant_name)}
                    />
                )
            })
        }
        </svg>
    );
  }
}

export default MapRestaurants;


// 30.412017, -97.745536
// 30.310526, -97.710549
