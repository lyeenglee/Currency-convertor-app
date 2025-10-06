import { StyleSheet, View } from "react-native";

export default function Divider() {
  return <View style={styles.greyBorder}></View>;
}

const styles = StyleSheet.create({
  greyBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
  },
});
