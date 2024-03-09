import type { ReactNode } from "react";
import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

import { cn } from "~/lib/utils";
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
    <View className="flex flex-col">
      <View className="flex flex-row items-center gap-4">
        <StatusCircle type={props.status} percentage={props.percentage ?? 0} />
        <Text
          className={cn("text-lg", {
            "text-white": props.status === "pending",
            "text-type-secondary": props.status !== "pending",
          })}
        >
          {props.name}
        </Text>
      </View>
      <View className="flex flex-row gap-4">
        <View style={{ width: 40 }} />
        <View>{text && <Text className="mt-1 text-lg">{text}</Text>}</View>
      </View>
      <View className="ml-12">{props.children}</View>
    </View>
  );
}

export function ScrapeCard(props: ScrapeCardProps) {
  return (
    <View className="w-96">
      <View
        className={cn("w-96 rounded-xl px-6 py-3", {
          "bg-video-scraping-card": props.hasChildren,
        })}
      >
        <ScrapeItem {...props} />
      </View>
    </View>
  );
}
