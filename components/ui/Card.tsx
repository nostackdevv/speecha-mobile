import { View } from 'react-native';

import { cn } from '@/lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  testID?: string;
}

export const Card = ({ children, className, testID }: CardProps) => (
  <View
    className={cn('rounded-20 bg-grey-50 p-6', className)}
    style={{ borderCurve: 'continuous' }}
    testID={testID}
  >
    {children}
  </View>
);
