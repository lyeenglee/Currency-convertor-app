import { Checkbox } from "expo-checkbox";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ItemProps = {
  currency: string;
  rate: number;
  isChecked: boolean;
  setNewRate: React.Dispatch<React.SetStateAction<string>>;
  setIsFocus: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (val: string) => void;
};

export default function RateItem({
  currency,
  rate,
  isChecked,
  setNewRate,
  setIsFocus,
  onChange,
}: ItemProps) {
  return (
    <Pressable onPress={() => onChange(currency)}>
      <View style={styles.dropDownItem}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Checkbox value={isChecked} />
          <Text style={styles.title}>{currency}</Text>
        </View>

        <Text>{rate}</Text>
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
});
