import { Link } from "expo-router";
import { H3, H5, Paragraph, View } from "tamagui";

import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";
import { MWInput } from "~/components/ui/Input";
import { useAuthStore } from "~/stores/settings";

export default function MovieWebScreen() {
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
              pathname: "/sync/trust/[url]",
              params: { url: backendUrl },
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
