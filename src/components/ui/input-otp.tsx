import { createContext, forwardRef, PropsWithChildren, useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { uiColors } from '@/theme/uiColors';
import { radii, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';
import { mergeStyles } from '@/lib/style';

interface OTPContextValue {
  value: string;
  maxLength: number;
  focused: boolean;
}

const OTPContext = createContext<OTPContextValue | null>(null);

function useOTPContext() {
  const ctx = useContext(OTPContext);
  if (!ctx) throw new Error('InputOTPSlot must be used within <InputOTP>');
  return ctx;
}

interface InputOTPProps extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText' | 'maxLength'> {
  maxLength: number;
  value: string;
  onChangeText: (value: string) => void;
  containerStyle?: ViewStyle;
}

export const InputOTP = forwardRef<TextInput, PropsWithChildren<InputOTPProps>>(
  ({ maxLength, value, onChangeText, containerStyle, children, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={mergeStyles<ViewStyle>(styles.wrapper, containerStyle)}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={(text) => onChangeText(text.slice(0, maxLength))}
          maxLength={maxLength}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          style={styles.hiddenInput}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        <OTPContext.Provider value={{ value, maxLength, focused }}>{children}</OTPContext.Provider>
      </View>
    );
  }
);
InputOTP.displayName = 'InputOTP';

export function InputOTPGroup({ style, children }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={mergeStyles<ViewStyle>(styles.group, style)}>{children}</View>;
}

interface InputOTPSlotProps {
  index: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function InputOTPSlot({ index, style, textStyle }: InputOTPSlotProps) {
  const { value, focused } = useOTPContext();
  const char = value[index];
  const isActive = focused && value.length === index;

  return (
    <View style={mergeStyles<ViewStyle>(styles.slot, isActive && styles.slotActive, style)}>
      {char ? (
        <Text style={mergeStyles<TextStyle>(styles.slotText, textStyle)}>{char}</Text>
      ) : isActive ? (
        <View style={styles.caret} />
      ) : null}
    </View>
  );
}

export function InputOTPSeparator({ style }: { style?: ViewStyle }) {
  return (
    <View style={mergeStyles<ViewStyle>(styles.separatorWrapper, style)}>
      <View style={styles.separatorDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  slot: {
    width: 40,
    height: 44,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: uiColors.border,
    backgroundColor: uiColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotActive: {
    borderColor: uiColors.ring,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  slotText: {
    fontFamily: fonts.sansBold,
    fontSize: 18,
    color: uiColors.foreground,
  },
  caret: {
    width: 1.5,
    height: 20,
    backgroundColor: uiColors.ring,
  },
  separatorWrapper: {
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: uiColors.mutedForeground,
  },
});
