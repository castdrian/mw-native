import { TouchableOpacity } from "react-native-gesture-handler";
import * as Clipboard from "expo-clipboard";
import { Link, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { H4, Paragraph, Text, useTheme, View, XStack, YStack } from "tamagui";

import { genMnemonic } from "@movie-web/api";

import ScreenLayout from "~/components/layout/ScreenLayout";
import { MWButton } from "~/components/ui/Button";
import { MWCard } from "~/components/ui/Card";

function PassphraseWord({ word }: { word: string }) {
  return (
    <View
      width="$10"
      borderRadius="$4"
      paddingHorizontal="$4"
      paddingVertical="$3"
      alignItems="center"
      justifyContent="center"
      backgroundColor="$shade400"
    >
      <Text fontWeight="$bold">{word}</Text>
    </View>
  );
}

export default function Page() {
  const theme = useTheme();
  const words = genMnemonic();

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
        <MWCard.Header>
          <H4 fontWeight="$bold" textAlign="center">
            Your passphrase
          </H4>

          <Paragraph
            color="$shade200"
            textAlign="center"
            fontWeight="$normal"
            paddingTop="$4"
          >
            Your passphrase acts as your username and password. Make sure to
            keep it safe as you will need to enter it to login to your account
          </Paragraph>
        </MWCard.Header>

        <YStack
          borderRadius="$4"
          borderColor="$shade200"
          borderWidth="$0.5"
          marginBottom="$4"
        >
          <XStack
            gap="$1"
            borderBottomWidth="$0.5"
            borderColor="$shade200"
            paddingVertical="$2"
            paddingHorizontal="$4"
          >
            <Text fontWeight="$bold" flexGrow={1}>
              Passphrase
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onPress={async () => {
                await Clipboard.setStringAsync(words);
              }}
            >
              <Feather name="copy" size={18} color={theme.shade200.val} />
              <Text color="$shade200" fontWeight="$bold">
                Copy
              </Text>
            </TouchableOpacity>
          </XStack>
          <View
            flexWrap="wrap"
            flexDirection="row"
            gap="$4"
            alignItems="center"
            justifyContent="center"
            padding="$3"
          >
            {words.split(" ").map((word, index) => (
              <PassphraseWord key={index} word={word} />
            ))}
          </View>
        </YStack>

        <MWCard.Footer justifyContent="center" flexDirection="column" gap="$4">
          <Link
            href={{
              pathname: "/sync/register/account",
            }}
            asChild
          >
            <MWButton type="purple">I have saved my passphrase</MWButton>
          </Link>

          <Paragraph color="$ash50" textAlign="center" fontWeight="$semibold">
            Already have an account?{"\n"}
            <Text color="$purple100" fontWeight="$bold">
              <Link
                href={{
                  pathname: "/sync/login",
                }}
              >
                Login here
              </Link>
            </Text>
          </Paragraph>
        </MWCard.Footer>
      </MWCard>
    </ScreenLayout>
  );
}
