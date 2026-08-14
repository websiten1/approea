import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Image, ImageProps, ImageStyle, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

const AvatarContext = createContext<{ imageFailed: boolean; setImageFailed: (v: boolean) => void } | null>(null);

function useAvatarContext() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('Avatar.* must be used within <Avatar>');
  return ctx;
}

interface AvatarProps {
  style?: ViewStyle;
  size?: number;
}

export function Avatar({ style, size = 40, children }: PropsWithChildren<AvatarProps>) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <AvatarContext.Provider value={{ imageFailed, setImageFailed }}>
      <View
        style={mergeStyles<ViewStyle>(
          styles.root,
          { width: size, height: size, borderRadius: size / 2 },
          style
        )}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
}

export function AvatarImage({ style, onError, ...props }: ImageProps) {
  const { imageFailed, setImageFailed } = useAvatarContext();
  if (imageFailed) return null;
  return (
    <Image
      style={mergeStyles<ImageStyle>(styles.image, style)}
      onError={(e) => {
        setImageFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}

interface AvatarFallbackProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function AvatarFallback({ style, textStyle, children }: PropsWithChildren<AvatarFallbackProps>) {
  return (
    <View style={mergeStyles<ViewStyle>(styles.fallback, style)}>
      {typeof children === 'string' ? (
        <Text style={mergeStyles<TextStyle>(styles.fallbackText, textStyle)}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: uiColors.muted,
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: uiColors.mutedForeground,
  },
});
