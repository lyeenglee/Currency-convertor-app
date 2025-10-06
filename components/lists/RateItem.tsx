import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { Checkbox } from "expo-checkbox";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ItemProps = {
  currency: string;
  rate: number;
  isChecked: boolean;
  selected: string;
  onChange: (val: string) => void;
};

export default function RateItem({
  currency,
  rate,
  isChecked,
  selected,
  onChange,
}: ItemProps) {
  return (
    <Pressable onPress={() => onChange(currency)}>
      <View style={styles.dropDownItem}>
        <View style={styles.leftItem}>
          <Checkbox
            value={isChecked}
            onValueChange={() => onChange(currency)}
          />

          <Text style={styles.title}>{getUnicodeFlagIcon(selected)}</Text>
          <Text style={styles.title}>{currency}</Text>
        </View>

        <Text style={styles.title}>{rate}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dropDownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#C9CDCF",
  },
  title: {
    fontSize: 16,
  },
  leftItem: {
    flexDirection: "row",
    gap: 10,
  },
});
