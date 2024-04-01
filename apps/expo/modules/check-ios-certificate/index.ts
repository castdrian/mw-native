// Import the native module. On web, it will be resolved to CheckIosCertificate.web.ts
// and on native platforms to CheckIosCertificate.ts
import CheckIosCertificateModule from "./src/CheckIosCertificateModule";

interface CheckIosCertificateModule {
	isDevelopmentProvisioningProfile(): boolean;
}

export function isDevelopmentProvisioningProfile(): boolean {
	return (CheckIosCertificateModule as CheckIosCertificateModule).isDevelopmentProvisioningProfile();
}
