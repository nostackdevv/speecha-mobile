import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from 'react-native-purchases';

const RC_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

export const PRO_ENTITLEMENT_ID = 'pro';

export const configureRevenueCat = () => {
  if (!RC_API_KEY) {
    console.warn(
      'Missing EXPO_PUBLIC_REVENUECAT_API_KEY — RevenueCat disabled'
    );
    return;
  }
  Purchases.configure({ apiKey: RC_API_KEY });
};

export const identifyUser = async (userId: string): Promise<CustomerInfo> => {
  const { customerInfo } = await Purchases.logIn(userId);
  return customerInfo;
};

export const logOutRevenueCat = async (): Promise<void> => {
  await Purchases.logOut();
};

export const fetchOfferings = async (): Promise<PurchasesOfferings> => {
  return Purchases.getOfferings();
};

export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<CustomerInfo> => {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
};

export const restorePurchases = async (): Promise<CustomerInfo> => {
  return Purchases.restorePurchases();
};

export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  return Purchases.getCustomerInfo();
};

export const hasProEntitlement = (customerInfo: CustomerInfo): boolean => {
  return !!customerInfo.entitlements.active[PRO_ENTITLEMENT_ID];
};
