import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Masthead } from '../../src/components/Masthead';
import { Hairline } from '../../src/components/Hairline';
import { PlayfulArcs } from '../../src/components/Playful';
import { SettingsIcon } from '../../src/components/icons';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { type as textType } from '../../src/theme/typography';

export default function AdminScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <Masthead title="ADMIN" accent="red" />
      <Hairline />
      <View style={styles.center}>
        <SettingsIcon color={colors.gold} size={30} strokeWidth={1.6} />
        <Text style={styles.message}>
          Panoul de administrare este în pregătire și va fi disponibil într-o versiune ulterioară.
        </Text>
      </View>
      <PlayfulArcs />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'relative',
    minHeight: '100%',
  },
  center: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  message: {
    ...textType.body,
    color: colors.inkSoft,
    textAlign: 'center',
  },
});
