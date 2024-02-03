import React from "react";
import { Platform } from "react-native";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";

export function ExternalLink(
  props: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string },
) {
  return (
    <Link
      hrefAttrs={{
        // On web, launch the link in a new tab.
        target: "_blank",
      }}
      {...props}
      // @ts-expect-error href is not a valid prop for Link, but we're using it here to pass the URL to the web browser.
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href).catch((error) => {
            console.error("Failed to open browser", error);
          });
        }
      }}
    />
  );
}
