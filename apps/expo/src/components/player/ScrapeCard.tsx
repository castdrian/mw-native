import type { ReactNode } from "react";
import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

import { Text } from "../ui/Text";

export interface ScrapeItemProps {
  status: "failure" | "pending" | "notfound" | "success" | "waiting";
  name: string;
  id?: string;
  percentage?: number;
  children?: ReactNode;
}

export interface ScrapeCardProps extends ScrapeItemProps {
  hasChildren?: boolean;
}

const statusTextMap: Partial<Record<ScrapeCardProps["status"], string>> = {
  notfound: "Doesn't have the video",
  failure: "Failed to scrape",
  pending: "Checking for videos...",
};

const mapPercentageToIcon = (percentage: number) => {
  const slice = Math.floor(percentage / 12.5);
  return `circle-slice-${slice === 0 ? 1 : slice}`;
};

export function StatusCircle({
  type,
  percentage,
}: {
  type: ScrapeItemProps["status"];
  percentage: number;
}) {
  return (
    <>
      {type === "waiting" && (
        <MaterialCommunityIcons
          name="circle-outline"
          size={40}
          color={defaultTheme.extend.colors.video.scraping.noresult}
        />
      )}
      {type === "pending" && (
        <MaterialCommunityIcons
          name={mapPercentageToIcon(percentage) as "circle-slice-1"}
          size={40}
          color={defaultTheme.extend.colors.video.scraping.loading}
        />
      )}
      {type === "failure" && (
        <MaterialCommunityIcons
          name="close-circle"
          size={40}
          color={defaultTheme.extend.colors.video.scraping.error}
        />
      )}
      {type === "notfound" && (
        <MaterialIcons
          name="remove-circle"
          size={40}
          color={defaultTheme.extend.colors.video.scraping.noresult}
        />
      )}
      {type === "success" && (
        <MaterialIcons
          name="check-circle"
          size={40}
          color={defaultTheme.extend.colors.video.scraping.success}
        />
      )}
    </>
  );
}

export function ScrapeItem(props: ScrapeItemProps) {
  const text = statusTextMap[props.status];

  return (
    <View style={styles.scrapeItemContainer}>
      <View style={styles.itemRow}>
        <StatusCircle type={props.status} percentage={props.percentage ?? 0} />
        <Text
          style={[
            styles.itemText,
            props.status === "pending"
              ? styles.textPending
              : styles.textSecondary,
          ]}
        >
          {props.name}
        </Text>
      </View>
      <View style={styles.textRow}>
        <View style={styles.spacer} />
        <View>{text && <Text style={styles.statusText}>{text}</Text>}</View>
      </View>
      <View style={styles.childrenContainer}>{props.children}</View>
    </View>
  );
}

export function ScrapeCard(props: ScrapeCardProps) {
  return (
    <View style={styles.cardContainer}>
      <View
        style={[
          styles.cardContent,
          props.hasChildren ? styles.cardBackground : null,
        ]}
      >
        <ScrapeItem {...props} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrapeItemContainer: {
    flex: 1,
    flexDirection: "column",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  itemText: {
    fontSize: 18,
  },
  textPending: {
    color: "white",
  },
  textSecondary: {
    color: "secondaryColor",
  },
  textRow: {
    flexDirection: "row",
    gap: 16,
  },
  spacer: {
    width: 40,
  },
  statusText: {
    marginTop: 4,
    fontSize: 18,
  },
  childrenContainer: {
    marginLeft: 48,
  },
  cardContainer: {
    width: 384,
  },
  cardContent: {
    width: 384,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cardBackground: {
    backgroundColor: "cardBackgroundColor",
  },
});
