import React, { Component } from 'react';
import './Portal.css';
import Background from './Background.js';
import Person from './Person';
import Missile from './Missile';
import paper from 'paper'

export default class Portal extends Component {
  componentDidMount() {
    var canvas = document.getElementById("canvas");
    window.addEventListener("resize", () => this.handleResize());
    paper.setup(canvas);
    this.view = paper.view;
    this.handleResize();
    this.ctx = canvas.getContext("2d");

    var center = this.view.center;
    center.y += this.view.bounds.height/6;

    this.background = new Background(this.view);

    var p = new Person({ctx:this.ctx, center:center});
    this.p = p;

    this.Missiles = []
    document.addEventListener('keyup',   (e) => this.handleKeys(e));
    document.addEventListener('keydown', (e) => this.handleKeys(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e, canvas));
    document.onclick = (e) => this.shoot(e, canvas);
    requestAnimationFrame(() => {this.rerender()});
  }

  shoot(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    const x = event.x - rect.left;
    const y = event.y - rect.top;
    this.p.shoot(x, y);
  }

  handleResize() {
    var canvas = document.getElementById("canvas");
    var rect = canvas.parentNode.getBoundingClientRect();

    this.view.viewSize.width = rect.width - 50;
    this.view.viewSize.height = window.innerHeight * 0.5;
  }

  handleMouseMove(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    const x = event.x - rect.left;
    const y = event.y - rect.top;
    this.p.positionArm(x, y);
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
    if(Math.random() > 0.98 && this.Missiles.length < 4) {
      this.Missiles.push(new Missile({ctx: this.ctx, x: this.view.bounds.width * Math.random(), y: 10, target: this.p.body.segments[0].point}));
    }
    this.Missiles.map(x => x.translate());
    this.deleteMissiles();
    for(let i = 0; i < this.background.stars.length; i++) {
      const star = this.background.stars[i];
      star.translate(new paper.Point(5/star.bounds.width, 0));
      if(star.bounds.x > this.view.bounds.width) {
        star.translate(new paper.Point(-this.view.bounds.width, 0));
      }
    }
    requestAnimationFrame(() => {this.rerender()});
  }

  deleteMissiles() {
    const g = this.Missiles[0];
    if(this.Missiles.length && (g.path.bottom.segments[0].point.x > this.view.bounds.width || g.path.bottom.segments[0].point.x < 0 || g.path.bottom.segments[0].point.y > this.view.bounds.height || g.path.cap.segments[0].point.y < 0)) {
      g.delete();
      this.Missiles.splice(0, 1)
    }
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
        <canvas id="canvas" height={window.innerHeight} width={window.innerWidth}></canvas>
    );
  }
}
