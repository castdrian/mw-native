import ExpoModulesCore

public class CheckIosCertificateModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('CheckIosCertificate')` in JavaScript.
        Name("CheckIosCertificate")

        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        Function("isDevelopmentProvisioningProfile") { () -> Any in
            #if targetEnvironment(simulator)
            // Running on the Simulator
            return true
            #else
            // Check for provisioning profile for non-Simulator execution
            guard let filePath = Bundle.main.path(forResource: "embedded", ofType: "mobileprovision") else {
                return false
            }

            let fileURL = URL(fileURLWithPath: filePath)
            do {
                let data = try String(contentsOf: fileURL, encoding: .ascii)
                let cleared = data.components(separatedBy: .whitespacesAndNewlines).joined()
                return cleared.contains("<key>get-task-allow</key><true/>")
            } catch {
                // Handling error if the file read fails
                print("Error reading provisioning profile: \(error)")
                return false
            }
            #endif
        }
    }
}
