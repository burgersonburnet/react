import React, { Component } from 'react';

export default function DefaultBubble(props) {

  return (
    <text
        style={{ visibility: (props.visible ? 'visible' : 'hidden') }}
        x={props.x}
        y={props.y}
    >
          {props.visible ? props.restaurant.restaurant_name : ''}
    </text>
  )
}