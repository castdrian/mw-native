import { Link } from "expo-router";
import { H3, H5, Paragraph, View } from "tamagui";

import { useAuthStore } from "~/stores/settings";
import ScreenLayout from "../layout/ScreenLayout";
import { MWButton } from "../ui/Button";
import { MWCard } from "../ui/Card";
import { MWInput } from "../ui/Input";

export function AccountGetStarted() {
  const { backendUrl, setBackendUrl } = useAuthStore();

  return (
    <ScreenLayout
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MWCard bordered padded>
        <MWCard.Header>
          <H3 fontWeight="$bold" paddingBottom="$1">
            Sync to the cloud
          </H3>
          <H5 color="$shade200" fontWeight="$semibold" paddingVertical="$3">
            Share your watch progress between devices and keep them synced.
          </H5>
          <Paragraph color="$shade200">
            First choose the backend you want to use. If you do not know what
            this does, use the default and click on &apos;Get started&apos;.
          </Paragraph>
        </MWCard.Header>

        <View padding="$4">
          <MWInput
            placeholder={backendUrl}
            type="authentication"
            value={backendUrl}
            onChangeText={setBackendUrl}
          />
        </View>

        <MWCard.Footer padded justifyContent="center">
          <Link
            href={{
              pathname: "/sync/trust/[backendUrl]",
              params: { backendUrl },
            }}
            asChild
          >
            <MWButton type="purple" width="100%">
              Get started
            </MWButton>
          </Link>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
