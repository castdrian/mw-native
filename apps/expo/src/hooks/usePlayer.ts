import type { VideoRef } from "react-native-video";
import { useCallback, useRef } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

export const usePlayer = () => {
  const ref = useRef<VideoRef>(null);

  const lockOrientation = useCallback(async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE,
    );
  }, []);

  const unlockOrientation = useCallback(async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  }, []);

  const presentFullscreenPlayer = useCallback(async () => {
    if (ref.current) {
      ref.current.presentFullscreenPlayer();
      await lockOrientation();
    }
  }, [lockOrientation]);

  const dismissFullscreenPlayer = useCallback(async () => {
    if (ref.current) {
      ref.current.dismissFullscreenPlayer();
      await unlockOrientation();
    }
  }, [unlockOrientation]);

  return {
    videoRef: ref,
    lockOrientation,
    unlockOrientation,
    presentFullscreenPlayer,
    dismissFullscreenPlayer,
  } as const;
};
