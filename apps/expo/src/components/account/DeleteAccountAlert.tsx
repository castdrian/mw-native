import { useMutation } from "@tanstack/react-query";
import { AlertDialog, XStack, YStack } from "tamagui";

import { deleteUser } from "@movie-web/api";

import { useAuth } from "~/hooks/useAuth";
import { useAuthStore } from "~/stores/settings";
import { MWButton } from "../ui/Button";

export function DeleteAccountAlert() {
  const account = useAuthStore((state) => state.account);
  const backendUrl = useAuthStore((state) => state.backendUrl);
  const { logout } = useAuth();

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
  });

  const deleteAccountMutation = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: () => deleteUser(backendUrl, account!),
    onSuccess: () => {
      logoutMutation.mutate();
    },
  });

  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        <MWButton type="danger" width="$14" alignSelf="flex-end">
          Delete account
        </MWButton>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap="$4">
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action is irreversible. All data will be deleted and nothing
              can be recovered.
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <MWButton>Cancel</MWButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action
                asChild
                onPress={() => deleteAccountMutation.mutate()}
              >
                <MWButton
                  type="purple"
                  isLoading={deleteAccountMutation.isPending}
                >
                  I am sure
                </MWButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
