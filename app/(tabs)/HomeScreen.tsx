import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [newRate, setNewRate] = useState<string>("");

  useEffect(() => {}, [newRate]);
  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Convertor</Text>
      </View>
      <View style={styles.stepContainer}>
        <View>
          <Text style={styles.subtitleText}>From</Text>
          <View style={styles.childContainer}>
            <Text style={styles.currencyContainer} disabled>
              MYR
            </Text>

            <TextInput
              defaultValue="100"
              style={styles.amtContainer}
            ></TextInput>
          </View>
        </View>

        <View>
          <Text style={styles.subtitleText}>To</Text>
          <View style={styles.childContainer}>
            <Pressable
              style={[
                styles.currencyContainer,
                isFocus && styles.currencyContainerFocused,
              ]}
              onPress={() => setIsFocus(!isFocus)}
            >
              <Text style={styles.currencyText}>{newRate}</Text>
              <Ionicons name="chevron-down" size={18} color={"grey"} />
            </Pressable>

            <TextInput
              // defaultValue="100"
              style={styles.amtContainer}
            ></TextInput>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    gap: 8,
  },
  titleText: {
    fontSize: 25,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: 500,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  childContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 15,
  },
  amtContainer: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#ececf0",
    borderRadius: 8,
    color: "#111827",
    fontSize: 16,
    // width: 200,
    flex: 1,
  },
  currencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#ececf0",
    borderRadius: 8,
    color: "#111827",
    fontSize: 16,
    width: 100,
  },
  currencyContainerFocused: {
    borderWidth: 2,
    borderColor: "rgba(59,130,246,0.5)", // like ring-blue-500/50
    shadowColor: "rgba(59,130,246,0.5)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3, // simulate a 3px ring
  },
});
