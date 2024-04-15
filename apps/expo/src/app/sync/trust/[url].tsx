import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { H4, Paragraph, Text, View } from "tamagui";

import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";

// TODO: extract to function with cleanup and types
const getBackendMeta = (
  url: string,
): Promise<{
  description: string;
  hasCaptcha: boolean;
  name: string;
  url: string;
}> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return fetch(`${url}/meta`).then((res) => res.json());
};

export default function Page() {
  const { url } = useLocalSearchParams();

  const meta = useQuery({
    queryKey: ["backendMeta", url],
    queryFn: () => getBackendMeta(url as string),
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
      <MWCard bordered>
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
                  {url}
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
          <MWButton type="purple">I trust this server</MWButton>
          <MWButton type="secondary">Go back</MWButton>

          <Paragraph color="$ash50" textAlign="center" fontWeight="$semibold">
            Already have an account?{" "}
            <Text color="$purple100" fontWeight="$bold">
              Login here
            </Text>
          </Paragraph>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
