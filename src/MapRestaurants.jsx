import React, { Component } from 'react';
import './MapRestaurants.css';

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
    const ratio = 792/272;
    const svgWidth = ratio * window.innerWidth;
    const svgHeight = ratio * window.innerHeight;
    // console.log('svgWidth', svgWidth, 'svgHeight', svgHeight)
    // const svgWidth = 272;
    // const svgHeight = 792;
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
    if (this.state.displayedInfo === null) {
      return;
    }

    console.log('mapX', this.state.displayedInfo.restaurant.mapX)
    console.log('window height', window.innerHeight)
    console.log('window width', window.innerWidth)
    
    // 2.9117647059
    // 229
    // 1.1877729258 = 272/229
    // 73 px from edge of canvas to edge of vp
    // about 61 user space pixels
    // 210 = 250/1.1877. 283 
    // 92 pix to edge
    // 109.2755484






    console.log(
      ((window.innerWidth - 
      this.state.displayedInfo.restaurant.mapX) / 2) -
      135
      )
    // let widthComparision = window.innerWidth / 272
    // console.log('with units', widthComparision)
    // let distanceFromEdge = 272 - this.state.displayedInfo.restaurant.mapX;
    // console.log('distance from edge', distanceFromEdge)
    // let overage = 135 - distanceFromEdge;
    // console.log('overage', overage)
    // // console.log('overage', overage*)
    // console.log('restaurant svg x', this.state.displayedInfo.restaurant.mapX)
    // console.log('side diff', (window.innerWidth - 272) / 2)

    // SVG usage:
    // begining control point x y, ending control point x y, final location x y

    let pathDescriptors;
    let endOffset = 15;
    let bubbleOffset = 35; // bubble travel from center
    if (this.state.displayedInfo.restaurant.mapY > 175) {
      if (window.innerWidth < 380 && this.state.displayedInfo.restaurant.mapX < 40) {
        endOffset = 30;
      }
      pathDescriptors = `M ${this.state.displayedInfo.restaurant.mapX + 8},
                ${this.state.displayedInfo.restaurant.mapY}
                c0,-15 -15,-15 -15,-15
                l-100,0 
                c0,0 -20,0 -20,-80 
                c0,-80 20,-80 20,-80 
                l230,0 
                c0,0 20,0 20,80 
                c0,80 -20,80 -20,80 
                l-100,0 
                c0,0 -15,0 -15,15 
                Z`;
    } else {
      pathDescriptors = `M ${(this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapX + 8 : 0)},
                ${(this.state.displayedInfo ? this.state.displayedInfo.restaurant.mapY + 16 : 0)}`
      pathDescriptors += 
        `c0,15 -15,15 -15,15 
        l-${100 + bubbleOffset},0
        c0,0 -20,0 -20,80 
        c0,80 20,80 20,80 
        l230,0 
        c0,0 20,0 20,-80 
        c0,-80 -20,-80 -20,-80
        l-${100 - bubbleOffset},0 
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
