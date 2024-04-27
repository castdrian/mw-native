import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

function isEqual(x: unknown, y: unknown): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) =>
          isEqual(x[key as keyof typeof x], y[key as keyof typeof y]),
        )
    : x === y;
}

export function useDerived<T>(
  initial: T,
): [T, Dispatch<SetStateAction<T>>, () => void, boolean] {
  const [overwrite, setOverwrite] = useState<T | undefined>(undefined);
  useEffect(() => {
    setOverwrite(undefined);
  }, [initial]);
  const changed = useMemo(
    () => !isEqual(overwrite, initial) && overwrite !== undefined,
    [overwrite, initial],
  );
  const setter = useCallback<Dispatch<SetStateAction<T>>>(
    (inp) => {
      if (!(inp instanceof Function)) setOverwrite(inp);
      else setOverwrite((s) => inp(s ?? initial));
    },
    [initial, setOverwrite],
  );
  const data = overwrite ?? initial;

  const reset = useCallback(() => setOverwrite(undefined), [setOverwrite]);

  return [data, setter, reset, changed];
}

export function useSettingsState(
  deviceName: string,
  proxyUrls: string[] | null,
  profile:
    | {
        colorA: string;
        colorB: string;
        icon: string;
      }
    | undefined,
) {
  const [proxyUrlsState, setProxyUrls, resetProxyUrls, proxyUrlsChanged] =
    useDerived(proxyUrls);

  const [
    deviceNameState,
    setDeviceNameState,
    resetDeviceName,
    deviceNameChanged,
  ] = useDerived(deviceName);
  const [profileState, setProfileState, resetProfile, profileChanged] =
    useDerived(profile);

  function reset() {
    resetProxyUrls();
    resetDeviceName();
    resetProfile();
  }

  const changed = deviceNameChanged || proxyUrlsChanged || profileChanged;

  return {
    reset,
    changed,
    deviceName: {
      state: deviceNameState,
      set: setDeviceNameState,
      changed: deviceNameChanged,
    },
    proxyUrls: {
      state: proxyUrlsState,
      set: setProxyUrls,
      changed: proxyUrlsChanged,
    },
    profile: {
      state: profileState,
      set: setProfileState,
      changed: profileChanged,
    },
  };
}
