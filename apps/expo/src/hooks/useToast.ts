import { useCallback } from "react";
import { useToastController } from "@tamagui/toast";

type ShowOptions = Parameters<ReturnType<typeof useToastController>["show"]>[1];

export const useToast = () => {
  const toastController = useToastController();

  const showToast = useCallback(
    (title: string, options?: ShowOptions) => {
      toastController.show(title, {
        burntOptions: { preset: "none" },
        native: true,
        duration: 500,
        ...options,
      });
    },
    [toastController],
  );

  return { showToast };
};
