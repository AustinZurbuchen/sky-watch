import type { ComponentType } from 'react';
import { ScrollView as RNScrollView, type ScrollViewProps } from 'react-native';

export const ScrollView = RNScrollView as unknown as ComponentType<ScrollViewProps>;
