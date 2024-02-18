import React from "react";

import Colors from "@movie-web/tailwind-config/colors";

interface SvgTabBarIconProps {
  focused?: boolean;
  children: React.ReactElement;
}

export default function SvgTabBarIcon({
  focused,
  children,
}: SvgTabBarIconProps) {
  const fillColor = focused ? Colors.primary[300] : Colors.secondary[300];

  if (React.isValidElement(children)) {
    return React.cloneElement(children, { fillColor } as React.Attributes);
  }

  return null;
}
