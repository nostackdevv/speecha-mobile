import Purchases, { type CustomerInfo } from 'react-native-purchases';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { hasProEntitlement } from '@/lib/revenueCat';

type SubscriptionContextValue = {
  customerInfo: CustomerInfo | null;
  isPro: boolean;
  isLoading: boolean;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null
);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPro = customerInfo ? hasProEntitlement(customerInfo) : false;

  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch {
      // SDK not configured yet or anonymous — will retry on auth
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCustomerInfo();

    const onUpdate = (info: CustomerInfo) => {
      setCustomerInfo(info);
      setIsLoading(false);
    };

    Purchases.addCustomerInfoUpdateListener(onUpdate);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(onUpdate);
    };
  }, [refreshCustomerInfo]);

  return (
    <SubscriptionContext.Provider value={{ customerInfo, isPro, isLoading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider'
    );
  }
  return context;
};
