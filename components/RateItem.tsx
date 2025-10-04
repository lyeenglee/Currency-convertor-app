import { Text, View } from "react-native";

type ItemProps = { currency: string; rate: number };

export default function RateItem({ currency, rate }: ItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{currency}</Text>
      <Text>{rate}</Text>
    </View>
  );
}
