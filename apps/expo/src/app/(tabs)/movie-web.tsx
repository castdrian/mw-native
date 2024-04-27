import { AccountInformation } from "~/components/account/AccountInformation";
import { AccountGetStarted } from "~/components/account/GetStarted";
import { useAuthStore } from "~/stores/settings";

export default function MovieWebScreen() {
  const account = useAuthStore((state) => state.account);

  if (account) return <AccountInformation />;
  return <AccountGetStarted />;
}
