import React, { Component } from 'react';
import './Portal.css';
import Background from './Background.js';
import Person from './Person';
import Missile from './Missile';
import NavBar from './NavBar';
import Menu from './Menu';
import paper from 'paper'

export default class Portal extends Component {
  state = {score: 0, highScore: 0, firstPlay: true, newHighScore: false, menuClass: "menu bigText", gameStarted: false};

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

    this.Missiles = [];
    this.explosions = [];
    document.addEventListener('keyup',   (e) => this.handleKeys(e));
    document.addEventListener('keydown', (e) => this.handleKeys(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e, canvas));
    document.onclick = (e) => this.shoot(e, canvas);
  }

  shoot(event, canvas) {
    if(this.state.gameStarted) {
      var rect = canvas.getBoundingClientRect();
      const x = event.x - rect.left;
      const y = event.y - rect.top;
      this.p.shoot(x, y);
      }
  }

  handleResize() {
    var canvas = document.getElementById("canvas");
    var rect = canvas.parentNode.getBoundingClientRect();

    this.view.viewSize.width = window.innerWidth;
    this.view.viewSize.height = window.innerHeight - 51;
  }

  handleMouseMove(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    const x = event.x - rect.left;
    const y = event.y - rect.top;
    this.p.positionArm(x, y);
  };

  startGame() {
    this.setState({score: 0, gameStarted: true, menuClass: "menu bigText hidden"});
    requestAnimationFrame(() => {this.rerender()});
  }

  endGame() {
    for(let i=0; i < this.Missiles.length; i++) {
      this.Missiles[i].delete();
    }
    for(let i=0; i < this.p.blasts.length; i++) {
      this.p.blasts[i].remove();
    }
    this.Missiles = [];
    this.setState({firstPlay: false, gameStarted: false, menuClass: "menu bigText"});
  }

  rerender() {
    if(!this.state.gameStarted) {
      return;
    }
    var temp = {...this.state};
    temp.score++;
    if(temp.highScore < temp.score) {
      temp.highScore = temp.score;
      temp.newHighScore = true;
    }
    this.setState(temp);

    if(this.p.step_forward || (this.p.inStep[0] && this.p.inStep[1] === "forward")) {
      this.p.step("forward");
      this.p.step_forward = false;
    }
    if(this.p.step_backward || (this.p.inStep[0] && this.p.inStep[1] === "backward")) {
      this.p.step("backward");
      this.p.step_backward = false;
    }
    if(Math.random() > Math.pow(0.98, this.state.score/1500) && this.Missiles.length < 8 + this.state.score / 25000) {
      this.Missiles.push(new Missile({ctx: this.ctx, x: this.view.bounds.width * Math.random(), y: 10, target: this.p.body.segments[0].point}));
    }
    this.Missiles.map(x => x.translate());
    for(let i = 0; i < this.Missiles.length; i++) {
      const g = this.Missiles[i];
      if(g.hit(this.p)) {
        this.explosions.push(g.explode());
        this.Missiles.splice(i, 1);
        setTimeout(() => this.endGame(), 350);
      }

      for(let b=0; b<this.p.blasts.length; b++) {
        if(this.p.blasts[b].hit(g)) {
           this.explosions.push(g.explode());
           this.Missiles.splice(i, 1);
           const temp = {...this.state};
           temp.score += 1000;
           this.setState(temp);
        }
      }
    }

    this.deleteMissiles();
    for(let i = 0; i < this.background.stars.length; i++) {
      const star = this.background.stars[i];
      star.translate(new paper.Point(star.bounds.width/4, 0));
      if(star.bounds.x > this.view.bounds.width) {
        star.translate(new paper.Point(-this.view.bounds.width, 0));
      }
    }
    for(let i = 0; i < this.p.blasts.length; i++) {
      if(this.p.blasts[i].deleted) {
        this.p.blasts.splice(i, 1);
      } else {
        this.p.blasts[i].animate();
      }
    }
    for(let i = 0; i < this.explosions.length; i++) {
      this.explosions[i].bounds.height += 10;
      this.explosions[i].bounds.width += 5;
      this.explosions[i].bounds.x -= 2.5;
      this.explosions[i].bounds.y -= 5;
      if(this.explosions[i].bounds.width >= this.view.bounds.width/30) {
        this.explosions[i].remove();
        this.explosions.splice(i, 1);
      }
    }
    requestAnimationFrame(() => {this.rerender()});
  }

  deleteMissiles() {
    for(let i=0; i<this.Missiles.length; i++) {
      const g = this.Missiles[i];
      if(this.Missiles.length && (g.path.bottom.segments[0].point.x > this.view.bounds.width || g.path.bottom.segments[0].point.x < 0 || g.path.bottom.segments[0].point.y > this.view.bounds.height || g.path.cap.segments[0].point.y < 0)) {
        g.delete();
        this.Missiles.splice(i, 1);
      }
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
        <div>
          <div className="container">
            <NavBar score={this.state.score} highScore={this.state.highScore}/>
            <canvas id="canvas" height={window.innerHeight} width={window.innerWidth}></canvas>
          </div>
          <Menu score={this.state.score} highScore={this.state.highScore} handleClick={()=>this.startGame()} firstPlay={this.state.firstPlay} menuClass={this.state.menuClass}/>
        </div>
    );
  }
}
