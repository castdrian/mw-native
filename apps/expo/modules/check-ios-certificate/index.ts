import CheckIosCertificateModule from "./src/CheckIosCertificateModule";

interface CheckIosCertificateModule {
  isDevelopmentProvisioningProfile(): boolean;
}

export function isDevelopmentProvisioningProfile(): boolean {
  return (
    CheckIosCertificateModule as CheckIosCertificateModule
  ).isDevelopmentProvisioningProfile();
}
