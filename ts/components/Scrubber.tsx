import * as React from "react";
import {StreamScrubber} from "../interfaces";

interface ScrubberProps extends React.Props<any> {
	scrubber:StreamScrubber;
	swapPlayers?:() => void;
	isFullscreen?:boolean;
	isFullscreenAvailable?:boolean;
	onClickFullscreen?:() => void;
	onClickMinimize?:() => void;
}

interface ScrubberState {
	playing?:boolean;
	canInteract?:boolean;
	canRewind?:boolean;
	canPlay?:boolean;
	speed?:number;
}

class Scrubber extends React.Component<ScrubberProps, ScrubberState> {

	constructor(props:ScrubberProps) {
		super(props);
		this.state = {
			playing: false,
			canInteract: false,
			canRewind: false,
			canPlay: false,
			speed: 1,
		};
		this.updateStateCb = this.updateState.bind(this);
		this.registerListeners(this.props);
	}

	private updateStateCb;

	public componentWillUpdate(nextProps:ScrubberProps, nextState:ScrubberState) {
		this.removeListeners(this.props);
		this.registerListeners(nextProps);
	}

	private registerListeners(props:ScrubberProps) {
		props.scrubber.on('update', this.updateStateCb);
	}

	private removeListeners(props:ScrubberProps) {
		props.scrubber.removeListener('update', this.updateStateCb);
	}

	protected updateState():void {
		var scrubber = this.props.scrubber;
		this.setState({
			playing: scrubber.isPlaying(),
			canInteract: scrubber.canInteract(),
			canPlay: scrubber.canPlay(),
			canRewind: scrubber.canRewind(),
			speed: scrubber.getSpeed()
		});
	}

	public componentWillUnmount() {
		this.removeListeners(this.props);
	}

	private pad(i:number, length:number) {
		return Array(length - (i + '').length + 1).join('0') + i;
	}

	public render():JSX.Element {
		var playpause = this.state.playing ?
			<button onClick={this.pause.bind(this)} disabled={!this.state.canInteract} title="Pause">⏸</button> :
			<button onClick={this.play.bind(this)} disabled={!this.state.canPlay} title="Play">▶</button>;

		var seconds = Math.round(this.props.scrubber.getCurrentTime() / 1000);
		var time = this.pad(Math.floor(seconds / 60), 2) + ':' + this.pad((seconds % 60), 2);
		var speedValues = [1, 2, 5, 10, 25];
		var speeds = speedValues.map(function (val) {
			return <option key={val} value={''+val}>{val}&times;</option>;
		}.bind(this));
		var fullscreen = this.props.isFullscreen ?
			<button onClick={this.props.onClickMinimize} title="Minimize">↙</button> :
			<button onClick={this.props.onClickFullscreen} disabled={!this.props.isFullscreenAvailable}
					title="Fullscreen">↗</button>;
		return (
			<div className="scrubber">
				{playpause}
				<button onClick={this.rewind.bind(this)} disabled={!this.state.canRewind} title="Rewind">⏮</button>
				<span className="scrubber-time">{time}</span>
				<div className="scrubber-history">
				</div>
				<select onChange={this.changeSpeed.bind(this)} value={''+this.state.speed}
						disabled={!this.state.canInteract} title="Playback speed">
					{speeds}
				</select>
				<button onClick={this.props.swapPlayers} disabled={!this.state.canInteract} title="Swap players">⇅
				</button>
				{fullscreen}
			</div>
		);
	}

	public play():void {
		this.props.scrubber.play();
	}

	public pause():void {
		this.props.scrubber.pause();
	}

	public rewind():void {
		this.props.scrubber.rewind();
	}

	public changeSpeed(e):void {
		var speed = Math.max(+e.target.value, 0);
		this.props.scrubber.setSpeed(speed);
	}
}

export default Scrubber;