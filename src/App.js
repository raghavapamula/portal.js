import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Person from './Person';

export default class App extends Component {
  state = {p: {}};

  componentDidMount() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var p = new Person({ctx:ctx, x:200, y:300});
    this.p = p;
  }

  shoot() {
    this.p.shoot();
  }

  stepForward() {
    this.p.stepForward();
  }

  render() {
    return (
      <div>
        <canvas id="canvas" height={window.innerHeight - 30} width={window.innerWidth}></canvas>
        <center><div>
          <button type="button" id="forward" onClick={() => this.stepForward()}>forward</button>
          <button type="button" id="forward" onClick={() => this.shoot()}>shoot</button>
        </div></center>
      </div>
    );
  }
}
