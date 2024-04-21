import { useCallback, useMemo, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { H5, Spinner, Text, View, XStack, YStack } from "tamagui";

import {
  base64ToBuffer,
  decryptData,
  editUser,
  encryptData,
  getSessions,
  removeSession,
  updateSession,
  updateSettings,
} from "@movie-web/api";

import { useAuth } from "~/hooks/useAuth";
import { useSettingsState } from "~/hooks/useSettingsState";
import { useAuthStore } from "~/stores/settings";
import ScreenLayout from "../layout/ScreenLayout";
import { MWButton } from "../ui/Button";
import { MWCard } from "../ui/Card";
import { MWInput } from "../ui/Input";
import { MWSeparator } from "../ui/Separator";
import { Avatar } from "./Avatar";
import { ChangeProfileModal } from "./ChangeProfileModal";
import { DeleteAccountAlert } from "./DeleteAccountAlert";
import { getDbIconFromExpoIcon, getExpoIconFromDbIcon } from "./UserIconPicker";

export function AccountInformation() {
  const account = useAuthStore((state) => state.account);
  const backendUrl = useAuthStore((state) => state.backendUrl);
  const proxySet = useAuthStore((s) => s.proxySet);
  const setProxySet = useAuthStore((s) => s.setProxySet);
  const updateProfile = useAuthStore((s) => s.setAccountProfile);
  const updateDeviceName = useAuthStore((s) => s.updateDeviceName);

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { decryptedName, logout } = useAuth();

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
  });

  const removeSessionMutation = useMutation({
    mutationKey: ["removeSession"],
    mutationFn: (sessionId: string) =>
      removeSession(backendUrl, account!.token, sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sessions", backendUrl, account],
      });
    },
  });

  const sessions = useQuery({
    queryKey: ["sessions", backendUrl, account],
    queryFn: () => getSessions(backendUrl, account!),
    enabled: !!account,
  });

  const deviceListSorted = useMemo(() => {
    if (!sessions.data || !account) return [];
    let list =
      sessions.data?.map((session) => {
        const decryptedName = decryptData(
          session.device,
          base64ToBuffer(account.seed),
        );
        return {
          current: session.id === account.sessionId,
          id: session.id,
          name: decryptedName,
        };
      }) ?? [];
    list = list.sort((a, b) => {
      if (a.current) return -1;
      if (b.current) return 1;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [sessions.data, account]);

  const state = useSettingsState(decryptedName, proxySet, account?.profile);

  const saveChanges = useCallback(async () => {
    if (account && backendUrl) {
      if (state.proxyUrls.changed) {
        await updateSettings(backendUrl, account, {
          proxyUrls: state.proxyUrls.state?.filter((v) => v !== "") ?? null,
        });
      }
      if (state.deviceName.changed) {
        const newDeviceName = await encryptData(
          state.deviceName.state,
          base64ToBuffer(account.seed),
        );
        await updateSession(backendUrl, account, {
          deviceName: newDeviceName,
        });
        updateDeviceName(newDeviceName);
      }
      if (state.profile.changed) {
        await editUser(backendUrl, account, {
          profile: state.profile.state,
        });
      }
    }

    setProxySet(state.proxyUrls.state?.filter((v) => v !== "") ?? null);

    if (state.profile.state) {
      updateProfile(state.profile.state);
    }
  }, [
    account,
    backendUrl,
    setProxySet,
    state.deviceName.changed,
    state.deviceName.state,
    state.profile.changed,
    state.profile.state,
    state.proxyUrls.changed,
    state.proxyUrls.state,
    updateDeviceName,
    updateProfile,
  ]);

  const saveChangesMutation = useMutation({
    mutationKey: ["saveChanges"],
    mutationFn: saveChanges,
  });

  if (!account) return null;

  return (
    <>
      <ScreenLayout>
        <YStack gap="$6">
          <YStack gap="$4">
            <Text fontSize="$7" fontWeight="$bold">
              Account
            </Text>
            <MWSeparator />

            {state.profile.state && (
              <MWCard bordered padded>
                <XStack gap="$4" alignItems="center">
                  <ChangeProfileModal
                    colorA={state.profile.state.colorA}
                    setColorA={(v) => {
                      state.profile.set((s) =>
                        s ? { ...s, colorA: v } : undefined,
                      );
                    }}
                    colorB={state.profile.state.colorB}
                    setColorB={(v) =>
                      state.profile.set((s) =>
                        s ? { ...s, colorB: v } : undefined,
                      )
                    }
                    icon={state.profile.state.icon}
                    setUserIcon={(v) =>
                      state.profile.set((s) =>
                        s
                          ? { ...s, icon: getDbIconFromExpoIcon(v) }
                          : undefined,
                      )
                    }
                    open={open}
                    setOpen={setOpen}
                  />
                  <Avatar
                    {...state.profile.state}
                    icon={getExpoIconFromDbIcon(state.profile.state.icon)}
                    width="$7"
                    height="$7"
                    bottomItem={
                      <XStack
                        backgroundColor="$shade200"
                        px="$2"
                        py="$1"
                        borderRadius="$4"
                        gap="$1.5"
                        alignItems="center"
                        onPress={() => setOpen(true)}
                      >
                        <MaterialIcons name="edit" size={10} color="white" />
                        <Text fontSize="$2">Edit</Text>
                      </XStack>
                    }
                    onPress={() => setOpen(true)}
                  />
                  <YStack gap="$4">
                    <Text fontWeight="$bold">Device name</Text>
                    <MWInput
                      type="authentication"
                      value={state.deviceName.state}
                      onChangeText={state.deviceName.set}
                      alignSelf="flex-start"
                      width="$14"
                    />

                    <MWButton
                      type="danger"
                      onPress={() => logoutMutation.mutate()}
                      alignSelf="flex-start"
                      isLoading={logoutMutation.isPending}
                    >
                      Logout
                    </MWButton>
                  </YStack>
                </XStack>
              </MWCard>
            )}
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$7" fontWeight="$bold">
              Devices
            </Text>
            <MWSeparator />
            {sessions.isLoading && <Spinner />}
            {sessions.isError && (
              <Text fontWeight="$bold" color="$rose200">
                Error loading sessions
              </Text>
            )}
            {deviceListSorted.map((device) => (
              <MWCard bordered padded key={device.id}>
                <XStack gap="$4" alignItems="center">
                  <YStack gap="$1" flexGrow={1}>
                    <Text fontWeight="$semibold" color="$ash300">
                      Device name
                    </Text>
                    <Text fontWeight="$bold">{device.name}</Text>
                  </YStack>
                  {!device.current && (
                    <MWButton
                      type="danger"
                      isLoading={removeSessionMutation.isPending}
                      onPress={() => removeSessionMutation.mutate(device.id)}
                    >
                      Remove
                    </MWButton>
                  )}
                </XStack>
              </MWCard>
            ))}
          </YStack>

          <YStack gap="$4">
            <Text fontSize="$7" fontWeight="$bold">
              Actions
            </Text>
            <MWSeparator />
            <MWCard bordered padded>
              <YStack gap="$3">
                <H5 fontWeight="$bold">Delete account</H5>
                <Text color="$ash300" fontWeight="$semibold">
                  This action is irreversible. All data will be deleted and
                  nothing can be recovered.
                </Text>
                <DeleteAccountAlert />
              </YStack>
            </MWCard>
          </YStack>
        </YStack>
      </ScreenLayout>

      {state.changed && (
        <View position="absolute" alignItems="center" bottom="$2" px="$2">
          <XStack
            width="100%"
            padding="$4"
            backgroundColor="$shade800"
            justifyContent="space-between"
            borderRadius="$4"
            animation="bounce"
            enterStyle={{
              y: 10,
              opacity: 0,
            }}
            opacity={1}
            scale={1}
          >
            <MWButton type="cancel" onPress={state.reset}>
              Reset
            </MWButton>
            <MWButton
              type="purple"
              onPress={() => saveChangesMutation.mutate()}
              isLoading={saveChangesMutation.isPending}
            >
              Save changes
            </MWButton>
          </XStack>
        </View>
      )}
    </>
  );
}
