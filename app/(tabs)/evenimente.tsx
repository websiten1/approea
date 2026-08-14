import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Masthead } from '../../src/components/Masthead';
import { Hairline } from '../../src/components/Hairline';
import { PlayfulBlobs } from '../../src/components/Playful';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { type as textType } from '../../src/theme/typography';

export default function EvenimenteScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <PlayfulBlobs />
      <Masthead title="EVENIMENTE" accent="blue" />
      <Hairline />
      <View style={styles.center}>
        <Text style={styles.message}>
          Calendarul evenimentelor eparhiale va fi disponibil aici într-o versiune ulterioară.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    position: 'relative',
  },
  center: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  message: {
    ...textType.body,
    color: colors.inkSoft,
    textAlign: 'center',
  },
});
