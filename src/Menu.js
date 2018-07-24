import React, { Component } from 'react';

export default class Menu extends Component {
    render() {
        if(this.props.firstPlay) {
            return(
                <div class={this.props.menuClass}>
                    <p>Use [A][D] or [←][→] to MOVE</p>
                    <p>Use Mouse to SHOOT</p>
                    <p class="button" onClick={()=>this.props.handleClick()}>Play</p>
                </div>
            );
        } else if(this.props.score == 0) {
            return(
                <div class={this.props.menuClass}>
                    <p>Game Over!</p>
                    <p>{this.props.score} points... You can do better!</p>
                    <p class="button" onClick={()=>this.props.handleClick()}>Play Again?</p>
                </div>
            );
        } else if(this.props.newHighScore) {
            return(
                <div class={this.props.menuClass}>
                    <p>Game Over!</p>
                    <p>New High Score! {this.props.score} points!</p>
                    <p class="button" onClick={()=>this.props.handleClick()}>Play Again?</p>
                </div>
            );
        } else {
            return(
                <div class={this.props.menuClass}>
                    <p>Game Over!</p>
                    <p>Not bad! {this.props.score} points!</p>
                    <p class="button" onClick={()=>this.props.handleClick()}>Play Again?</p>
                </div>
            );
        }
    }
}