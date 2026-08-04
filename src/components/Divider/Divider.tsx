import Text from '@/components/Text';
import useThemedStyles from '@/hooks/useThemedStyles';
import { View } from 'react-native';
import makeStyles from './Divider.styles';

type DividerProps = {
  text?: string;
};

function Divider({ text }: DividerProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.line} />
      {text ? (
        <>
          <Text uppercase variant="caption" style={styles.text}>
            {text}
          </Text>
          <View style={styles.line} />
        </>
      ) : null}
    </View>
  );
}

export default Divider;
