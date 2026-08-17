import { StyleSheet, Text, View } from 'react-native';
import { Screen } from './Screen';
import { OrthodoxCross } from './OrthodoxCross';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { type as textType, fonts } from '../theme/typography';

interface Props {
  title?: string;
  message?: string;
}

export function ComingSoon({ title, message }: Props) {
  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <OrthodoxCross color={colors.ink} size={28} strokeWidth={1.4} />
        <Text style={styles.title}>{title ?? 'Această secțiune urmează a fi refăcută'}</Text>
        <Text style={styles.message}>
          {message ??
            'Designul complet va fi aplicat după aprobarea paletei și a tipografiei pe ecranele „Astăzi" și „Calendar".'}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    lineHeight: 32,
    color: colors.ink,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...textType.body,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
