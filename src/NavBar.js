import React, { Component } from 'react';

export default class NavBar extends Component {
    render() {
        return(
            <div class="row">
                <div class="column left bigText">Score: {this.props.score}</div>
                <div class="column middle smallText">Use [A][D] or [←][→] to MOVE
                <br /> Use Mouse to SHOOT</div>
                <div class="column right bigText">High Score: {this.props.highScore}</div>
            </div>
        );
    }
}