import { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';
import { mergeStyles } from '@/lib/style';

interface AspectRatioProps {
  ratio?: number;
  style?: ViewStyle;
}

export function AspectRatio({ ratio = 1, style, children }: PropsWithChildren<AspectRatioProps>) {
  return <View style={mergeStyles<ViewStyle>({ width: '100%', aspectRatio: ratio }, style)}>{children}</View>;
}
