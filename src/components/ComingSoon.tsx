import { StyleSheet, Text, View } from 'react-native';
import { Screen } from './Screen';
import { OrthodoxCross } from './OrthodoxCross';
import { Divider } from './Divider';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { type as textType, fonts } from '../theme/typography';

interface Props {
  title: string;
  message?: string;
}

export function ComingSoon({ title, message }: Props) {
  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <OrthodoxCross color={colors.gold} size={30} strokeWidth={1.6} />
        <Text style={styles.title}>{title}</Text>
        <Divider />
        <Text style={styles.message}>
          {message ?? 'Această secțiune este în pregătire și va fi disponibilă într-o versiune ulterioară.'}
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
    fontSize: 22,
    color: colors.ink,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...textType.body,
    color: colors.inkSoft,
    textAlign: 'center',
  },
});
