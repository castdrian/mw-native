import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { H3, Spinner, Text, XStack, YStack } from "tamagui";

import {
  base64ToBuffer,
  decryptData,
  getSessions,
  removeSession,
} from "@movie-web/api";

import { useAuth } from "~/hooks/useAuth";
import { useAuthStore } from "~/stores/settings";
import ScreenLayout from "../layout/ScreenLayout";
import { MWButton } from "../ui/Button";
import { MWCard } from "../ui/Card";
import { MWInput } from "../ui/Input";
import { MWSeparator } from "../ui/Separator";
import { Avatar } from "./Avatar";
import { DeleteAccountAlert } from "./DeleteAccountAlert";
import { getExpoIconFromDbIcon } from "./UserIconPicker";

export function AccountInformation() {
  const account = useAuthStore((state) => state.account);
  const backendUrl = useAuthStore((state) => state.backendUrl);
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
    let list =
      sessions.data?.map((session) => {
        const decryptedName = decryptData(
          session.device,
          base64ToBuffer(account!.seed),
        );
        return {
          current: session.id === account!.sessionId,
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

  if (!account) return null;

  return (
    <ScreenLayout>
      <YStack gap="$6">
        <YStack gap="$4">
          <Text fontSize="$7" fontWeight="$bold">
            Account
          </Text>
          <MWSeparator />

          <MWCard bordered padded>
            <XStack gap="$4" alignItems="center">
              <Avatar
                {...account.profile}
                icon={getExpoIconFromDbIcon(account.profile.icon)}
                width="$7"
                height="$7"
              />
              <YStack gap="$4">
                <Text fontWeight="$bold">Device name</Text>
                <MWInput
                  type="authentication"
                  value={decryptedName}
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
              <H3 fontWeight="$bold">Delete account</H3>
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
  );
}
