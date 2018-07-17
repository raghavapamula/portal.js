import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Person from './Person';
import paper from 'paper'

export default class App extends Component {
  componentDidMount() {
    var canvas = document.getElementById("canvas");
    paper.setup(canvas);
    this.view = paper.view;
    var ctx = canvas.getContext("2d");
    var p = new Person({ctx:ctx, x:200, y:300});
    this.p = p;
    document.addEventListener('keyup',   (e) => this.handleKeys(e));
    document.addEventListener('keydown', (e) => this.handleKeys(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.onclick = (e) => this.p.shoot(e.x, e.y);
    requestAnimationFrame(() => {this.rerender()});
  }

  handleMouseMove(event) {
    this.p.positionArm(event.x, event.y);
  };

  rerender() {
    if(this.p.step_forward || (this.p.inStep[0] && this.p.inStep[1] === "forward")) {
      this.p.step("forward");
      this.p.step_forward = false;
    }
    if(this.p.step_backward || (this.p.inStep[0] && this.p.inStep[1] === "backward")) {
      this.p.step("backward");
      this.p.step_backward = false;
    }
    requestAnimationFrame(() => {this.rerender()});
  }

  shoot() {
    this.p.shoot();
  }

  step(e) {
    const direction = e.target.id;
    this.p.step(direction);
  }

  handleKeys(e) {
    if(this.p.step_forward || this.p.step_backward) {
      return;
    }
    switch(e.key) {
      case "ArrowRight":
          this.p.step_forward = true;
          break;
      case "d":
          this.p.step_forward = true;
          break;
      case "ArrowLeft":
          this.p.step_backward = true;
          break;
      case "a":
          this.p.step_backward = true;
      default:
          break;
    }
    return;
  }

  render() {
    return (
      <div onKeyDown={(e) => alert("D")}>
        <header><h1><center>Use the mouse to shoot and arrow keys to move</center></h1></header>
        <canvas id="canvas" height={window.innerHeight - 30} width={window.innerWidth}></canvas>
        <center><div>
        </div></center>
      </div>
    );
  }
}
