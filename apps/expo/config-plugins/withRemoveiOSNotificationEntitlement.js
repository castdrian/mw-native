/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const withEntitlementsPlist = require("@expo/config-plugins").withEntitlementsPlist;

const withRemoveiOSNotificationEntitlement = (config) => {
    return withEntitlementsPlist(config, mod => {
        delete mod.modResults['aps-environment'];
        return mod;
    })
}

module.exports = withRemoveiOSNotificationEntitlement;