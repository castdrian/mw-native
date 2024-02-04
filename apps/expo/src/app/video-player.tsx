import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import type { VideoRef } from 'react-native-video';
import Video from 'react-native-video';

interface VideoPlayerState {
  videoUrl: string;
  fullscreen: boolean;
  isLoading: boolean;
  paused: boolean;
}

class VideoPlayer extends Component<object, VideoPlayerState> {
  private videoPlayer: React.RefObject<VideoRef>;

  constructor(props: object) {
    super(props);
    this.state = {
      videoUrl: 'your_video_url',
      fullscreen: true,
      isLoading: true,
      paused: false
    };
    this.videoPlayer = React.createRef();
  }

  componentDidMount() {
    if (this.videoPlayer.current) {
      this.videoPlayer.current.presentFullscreenPlayer();
    }
  }

  onVideoLoadStart = () => {
    this.setState({ isLoading: true });
  };

  onReadyForDisplay = () => {
    this.setState({ isLoading: false });
  };

  onVideoError = () => {
    console.log("Video playback error");
  };

  render() {
    return (
      <View style={styles.container}>
        <Video
          ref={this.videoPlayer}
          source={{ uri: this.state.videoUrl }}
          style={styles.fullScreen}
          fullscreen={this.state.fullscreen}
          paused={this.state.paused}
          onLoadStart={this.onVideoLoadStart}
          onReadyForDisplay={this.onReadyForDisplay}
          onError={this.onVideoError}
        />
        {this.state.isLoading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});

export default VideoPlayer;