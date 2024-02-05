import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { VideoRef } from 'react-native-video';
import Video from 'react-native-video';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useLocalSearchParams } from "expo-router";

interface VideoPlayerState {
  videoUrl: string;
  fullscreen: boolean;
  isLoading: boolean;
  paused: boolean;
}

interface VideoPlayerProps {
	videoUrl: string;
}

export default function VideoPlayerWrapper() {
	const params = useLocalSearchParams();
	const videoUrl = typeof params.videoUrl === 'string' ? params.videoUrl : '';
	return <VideoPlayer videoUrl={videoUrl} />;
  }

  class VideoPlayer extends Component<VideoPlayerProps, VideoPlayerState> {
	private videoPlayer: React.RefObject<VideoRef>;

   constructor(props: VideoPlayerProps) {
    super(props);
    this.state = {
      videoUrl: props.videoUrl || '',
      fullscreen: true,
      isLoading: true,
      paused: false
    };
    this.videoPlayer = React.createRef();
  }

  componentDidMount() {
	const lockOrientation = async () => {
	  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
	};
  
	const { videoUrl } = this.props;
	
	this.setState({ videoUrl }, () => {
	  if (this.videoPlayer.current) {
		this.videoPlayer.current.presentFullscreenPlayer();
		void lockOrientation();
	  }
	});
  }

  componentWillUnmount() {
	const unlockOrientation = async () => {
	  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
	}

	if (this.videoPlayer.current) {
	  this.videoPlayer.current.dismissFullscreenPlayer();
	}
	void unlockOrientation();
  }

  onVideoLoadStart = () => {
    this.setState({ isLoading: true });
  };

  onReadyForDisplay = () => {
    this.setState({ isLoading: false });
  };

//   onVideoError = () => {  // probably useful later
//     console.log("Video playback error");
//   };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Video
          ref={this.videoPlayer}
          source={{ uri: this.state.videoUrl }}
          style={styles.fullScreen}
          fullscreen={this.state.fullscreen}
          paused={this.state.paused}
		  controls={true}
          onLoadStart={this.onVideoLoadStart}
          onReadyForDisplay={this.onReadyForDisplay}
          // onError={this.onVideoError}
        />
        {this.state.isLoading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </SafeAreaView>
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
  },
    
});
