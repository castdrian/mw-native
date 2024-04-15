import { Link } from "expo-router";
import { H2, H5, Paragraph, View } from "tamagui";

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
      <MWCard bordered>
        <MWCard.Header padded>
          <H2 fontWeight="$bold" paddingBottom="$1">
            Sync to the cloud
          </H2>
          <H5 color="$ash50" fontWeight="$semibold" paddingVertical="$3">
            Share your watch progress between devices and keep them synced.
          </H5>
          <Paragraph color="$ash50">
            First choose the backend you want to use. If you do not know what
            this does, use the default and click on &apos;Get started&apos;.
          </Paragraph>
        </MWCard.Header>

        <View padding="$4">
          <MWInput
            placeholder={backendUrl}
            type="search"
            value={backendUrl}
            onChangeText={setBackendUrl}
          />
        </View>

        <MWCard.Footer padded justifyContent="center">
          <MWButton type="purple">
            <Link
              href={{
                pathname: "/sync/trust/[url]",
                params: { url: backendUrl },
              }}
              style={{ color: "white", fontWeight: "bold" }}
            >
              Get started
            </Link>
          </MWButton>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
