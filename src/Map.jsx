import React, { Component } from 'react';
import './Map.css';
import MapBackground from './MapBackground';
import MapRestaurants from './MapRestaurants';

class Map extends Component {
  render() {
    return (
      <div className="Map">
        <MapBackground />
        <MapRestaurants restaurants={this.props.restaurants} />
      </div>
    );
  }
}

export default Map;


// 30.412017, -97.745536
