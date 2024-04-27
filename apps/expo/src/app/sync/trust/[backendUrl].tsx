import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { H4, Paragraph, Text, View } from "tamagui";

import { getBackendMeta } from "@movie-web/api";

import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";
import { useAuthStore } from "~/stores/settings";

export default function Page() {
  const { backendUrl } = useLocalSearchParams<{ backendUrl: string }>();

  const setBackendUrl = useAuthStore((state) => state.setBackendUrl);

  const meta = useQuery({
    queryKey: ["backendMeta", backendUrl],
    queryFn: () => getBackendMeta(backendUrl as unknown as string),
  });

  return (
    <ScreenLayout
      showHeader={false}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack.Screen
        options={{
          title: "",
        }}
      />
      <MWCard bordered padded>
        <MWCard.Header padded>
          <H4 fontWeight="$bold" textAlign="center">
            Do you trust this server?
          </H4>

          <Paragraph
            color="$ash50"
            textAlign="center"
            fontWeight="$semibold"
            paddingVertical="$4"
          >
            {meta.isLoading && "Loading..."}
            {meta.isError && "Error loading metadata"}
            {meta.isSuccess && (
              <>
                You are connecting to{" "}
                <Text
                  fontWeight="$bold"
                  color="white"
                  textDecorationLine="underline"
                >
                  {backendUrl}
                </Text>
                . Please confirm you trust it before making an account.
              </>
            )}
          </Paragraph>
        </MWCard.Header>

        {meta.isSuccess && (
          <View
            borderColor="$shade200"
            borderWidth="$0.5"
            borderRadius="$8"
            paddingHorizontal="$5"
            paddingVertical="$4"
            width="90%"
            alignSelf="center"
          >
            <Text
              fontWeight="$bold"
              paddingBottom="$1"
              textAlign="center"
              fontSize="$4"
            >
              {meta.data.name}
            </Text>

            <Paragraph color="$ash50" textAlign="center">
              {meta.data.description}
            </Paragraph>
          </View>
        )}
        <MWCard.Footer
          padded
          justifyContent="center"
          flexDirection="column"
          gap="$4"
        >
          <Link
            href={{
              pathname: "/sync/register",
            }}
            asChild
            onPress={() => {
              setBackendUrl(backendUrl as unknown as string);
            }}
          >
            <MWButton type="purple" disabled={!meta.isSuccess}>
              I trust this server
            </MWButton>
          </Link>
          <Link
            href={{
              pathname: "/(tabs)/",
            }}
            replace
            asChild
          >
            <MWButton type="cancel">Go back</MWButton>
          </Link>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
