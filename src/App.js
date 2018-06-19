import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Person from './Person';

export default class App extends Component {
  componentDidMount() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    // ctx.moveTo(0,0);
    // ctx.lineTo(100,100);
    // ctx.stroke();
    var p = new Person({ctx:ctx, x:200, y:300});
    p.shoot();
    p.stepForward();
  }
  render() {
    return (
      <canvas id="canvas" height={window.innerHeight} width={window.innerWidth}></canvas>
    );
  }
}
