import type { VideoRef } from "react-native-video";
import React, { createContext, useCallback, useContext, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

interface PlayerContextProps {
  videoRef: VideoRef | null;
  setVideoRef: (ref: VideoRef | null) => void;
  lockOrientation: () => Promise<void>;
  unlockOrientation: () => Promise<void>;
  presentFullscreenPlayer: () => Promise<void>;
  dismissFullscreenPlayer: () => Promise<void>;
}

interface PlayerProviderProps {
  children: React.ReactNode;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [internalVideoRef, setInternalVideoRef] = useState<VideoRef | null>(
    null,
  );

  const setVideoRef = useCallback((ref: VideoRef | null) => {
    setInternalVideoRef(ref);
  }, []);

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
    if (internalVideoRef) {
      internalVideoRef.presentFullscreenPlayer();
      await lockOrientation();
    }
  }, [internalVideoRef, lockOrientation]);

  const dismissFullscreenPlayer = useCallback(async () => {
    if (internalVideoRef) {
      internalVideoRef.dismissFullscreenPlayer();
      await unlockOrientation();
    }
  }, [internalVideoRef, unlockOrientation]);

  const contextValue: PlayerContextProps = {
    videoRef: internalVideoRef,
    setVideoRef,
    lockOrientation,
    unlockOrientation,
    presentFullscreenPlayer,
    dismissFullscreenPlayer,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
