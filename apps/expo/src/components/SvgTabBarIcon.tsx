import React from "react";

import { defaultTheme } from "@movie-web/tailwind-config/themes";

interface SvgTabBarIconProps {
  focused?: boolean;
  children: React.ReactElement;
}

export default function SvgTabBarIcon({
  focused,
  children,
}: SvgTabBarIconProps) {
  const fillColor = focused
    ? defaultTheme.extend.colors.tabBar.active
    : defaultTheme.extend.colors.tabBar.inactive;

  if (React.isValidElement(children)) {
    return React.cloneElement(children, { fillColor } as React.Attributes);
  }

  return null;
}
