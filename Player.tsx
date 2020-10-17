import React, { useState, Component } from 'react';
import {
    View,
    Text,
    StatusBar,
} from 'react-native';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import Video from 'react-native-video';

interface ITracks {
    title: string;
    artist: string;
    albumArtUrl: string;
    audioUrl: string;
};

interface Props {
    tracks: ITracks[];
}

const Player = (props: Props) => {

    const stepInput: React.RefObject<Video> = React.createRef();

    const [paused, setPaused] = useState<boolean>(true);
    const [totalLength, setTotalLength] = useState<number>(1);
    const [currentPosition, setCurrentPosition] = useState<number>(0);
    const [selectedTrack, setSelectedTrack] = useState<number>(0);
    const [repeatOn, setRepeatOn] = useState<boolean>(false);
    const [shuffleOn, setShuffleOn] = useState<boolean>(false);
    const [isChanging, setIsChanging] = useState<boolean>(false);

    function setDuration(data: any): void {
        setTotalLength(Math.floor(data.duration));
    }

    function setTime(data: any): void {
        setCurrentPosition(Math.floor(data.currentTime));
    }

    function seek(time: number): void {
        time = Math.round(time);
        stepInput && stepInput.current?.seek(time);
        setCurrentPosition(time);
        setPaused(false);
    }

    function onBack(): void {
        if (currentPosition < 10 && selectedTrack > 0) {
            stepInput && stepInput.current?.seek(0);
            setIsChanging(true);
            setTimeout(() => {
                setCurrentPosition(0);
                setPaused(false);
                setTotalLength(1);
                setIsChanging(false);
                setSelectedTrack(selectedTrack - 1);
            }, 0);
        } else {
            stepInput.current?.seek(0);
            setCurrentPosition(0);
        }
    }

    function onForward(): void {
        if (selectedTrack < props.tracks.length - 1) {
            stepInput && stepInput.current?.seek(0);
            setIsChanging(true);
            setTimeout(() => {
                setCurrentPosition(0);
                setPaused(false);
                setTotalLength(1);
                setIsChanging(false);
                setSelectedTrack(selectedTrack + 1);
            }, 0);
        }
    }

    const track = props.tracks[selectedTrack];
    const video = isChanging ? null : (
        <Video source={{ uri: track.audioUrl }}
            ref={stepInput}
            paused={paused}
            resizeMode="cover"
            repeat={true}
            onLoadStart={() => {}}
            onLoad={setDuration.bind(this)}
            onProgress={setTime.bind(this)}
            onEnd={() => {}}
            onError={() => {}}
            style={styles.audioElement} />
    );

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Header message="Playing From Charts" />
            <AlbumArt url={track.albumArtUrl} />
            <TrackDetails title={track.title} artist={track.artist} />
            <SeekBar
                onSeek={seek.bind(this)}
                trackLength={totalLength}
                onSlidingStart={() => setPaused(true)}
                currentPosition={currentPosition} />
            <Controls
                onPressRepeat={() => setRepeatOn(!repeatOn)}
                repeatOn={repeatOn}
                shuffleOn={shuffleOn}
                forwardDisabled={selectedTrack === props.tracks.length - 1}
                onPressShuffle={() => setShuffleOn(!shuffleOn)}
                onPressPlay={() => setPaused(false)}
                onPressPause={() => setPaused(true)}
                onBack={onBack.bind(this)}
                onForward={onForward.bind(this)}
                paused={paused} />
            {video}
        </View>
    );
}

export default Player;
/* export default class Player extends Component {

    constructor(props: ITracks[]) {
        super(props);

        this.state = {
            paused: true,
            totalLength: 1,
            currentPosition: 0,
            selectedTrack: 0,
            repeatOn: false,
            shuffleOn: false,
        };

        const [paused, setPaused] = useState<boolean>(true);
        const [totalLength, setTotalLength] = useState<number>(1);
        const [currentPosition, setCurrentPosition] = useState<number>(0);
        const [selectedTrack, setSelectedTrack] = useState<number>(0);
        const [repeatOn, setRepeatOn] = useState<boolean>(false);
        const [shuffleOn, setShuffleOn] = useState<boolean>(false);
    }

    setDuration(data: any): void {
        this.setState({ totalLength: Math.floor(data.duration) });
    }

    setTime(data: any): void {
        this.setState({ currentPosition: Math.floor(data.currentTime) });
    }

    seek(time: number): void {
        time = Math.round(time);
        this.refs.audioElement && this.refs.audioElement.seek(time);
        this.setState({
            currentPosition: time,
            paused: false,
        });
    }

    onBack(): void {
        if (this.state.currentPosition < 10 && this.state.selectedTrack > 0) {
            this.refs.audioElement && this.refs.audioElement.seek(0);
            this.setState({ isChanging: true });
            setTimeout(() => this.setState({
                currentPosition: 0,
                paused: false,
                totalLength: 1,
                isChanging: false,
                selectedTrack: this.state.selectedTrack - 1,
            }), 0);
        } else {
            this.refs.audioElement.seek(0);
            this.setState({
                currentPosition: 0,
            });
        }
    }

    onForward(): void {
        if (this.state.selectedTrack < this.props.tracks.length - 1) {
            this.refs.audioElement && this.refs.audioElement.seek(0);
            this.setState({ isChanging: true });
            setTimeout(() => this.setState({
                currentPosition: 0,
                totalLength: 1,
                paused: false,
                isChanging: false,
                selectedTrack: this.state.selectedTrack + 1,
            }), 0);
        }
    }

    render(): any {
        const track = this.props.tracks[this.state.selectedTrack];
        const video = this.state.isChanging ? null : (
            <Video source={{ uri: track.audioUrl }}
                ref="audioElement"
                paused={this.state.paused}
                resizeMode="cover"
                repeat={true}
                onLoadStart={this.loadStart}
                onLoad={this.setDuration.bind(this)}
                onProgress={this.setTime.bind(this)}
                onEnd={this.onEnd}
                onError={this.videoError}
                style={styles.audioElement} />
        );

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <Header message="Playing From Charts" />
                <AlbumArt url={track.albumArtUrl} />
                <TrackDetails title={track.title} artist={track.artist} />
                <SeekBar
                    onSeek={this.seek.bind(this)}
                    trackLength={this.state.totalLength}
                    onSlidingStart={() => this.setState({ paused: true })}
                    currentPosition={this.state.currentPosition} />
                <Controls
                    onPressRepeat={() => this.setState({ repeatOn: !this.state.repeatOn })}
                    repeatOn={this.state.repeatOn}
                    shuffleOn={this.state.shuffleOn}
                    forwardDisabled={this.state.selectedTrack === this.props.tracks.length - 1}
                    onPressShuffle={() => this.setState({ shuffleOn: !this.state.shuffleOn })}
                    onPressPlay={() => this.setState({ paused: false })}
                    onPressPause={() => this.setState({ paused: true })}
                    onBack={this.onBack.bind(this)}
                    onForward={this.onForward.bind(this)}
                    paused={this.state.paused} />
                {video}
            </View>
        );
    }
} */

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'rgb(4,4,4)',
    },
    audioElement: {
        height: 0,
        width: 0,
    }
};