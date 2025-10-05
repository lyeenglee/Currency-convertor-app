import BottomModal from "@/components/modals/BottomModal";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type CurrencyRate = {
  currency: string;
  rate: number;
};

export type CheckedRate = {
  currency: string;
};

export default function HomeScreen() {
  const token = process.env.EXPO_PUBLIC_EXCHANGERATE_TOKEN;
  const screenHeight = Dimensions.get("window").height;
  console.log("screenHeight: ", screenHeight);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [newRate, setNewRate] = useState<string>("");
  const [currencyList, setCurrencyList] = useState<CurrencyRate[]>([]);
  const [convertedList, setConvertedList] = useState<CurrencyRate[]>([]);
  const [checkedList, setCheckedList] = useState<CheckedRate[]>([]);
  const [amt, setAmt] = useState<string>("");
  // const [convertedAmt, setConvertedAmt] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    handleNewRate(amt);
  }, [amt, checkedList]);

  useEffect(() => {
    getAllRating();
  }, []);

  const getAllRating = async () => {
    console.log(1, token);
    let url = `https://v6.exchangerate-api.com/v6/${token}/latest/MYR`; //TODO: restructure to access token
    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        throw new Error("Error fetching api");
      }
      const { conversion_rates, time_last_update_utc } = await response.json();

      const formattedCurrencyList: CurrencyRate[] = Object.entries(
        conversion_rates
      ).map(([currency, rate]) => ({
        currency,
        rate: Number(rate),
      }));

      setCurrencyList(
        formattedCurrencyList.filter((itm) => itm.currency !== "MYR")
      );
      const formattedLastUpdated = new Date(time_last_update_utc).toUTCString();
      setLastUpdated(formattedLastUpdated);
    } catch (error) {
      console.log("error");
    }
  };

  const handleNewRate = (amt: string) => {
    if (checkedList.length > 0) {
      const selectedCurrencyList = currencyList.filter((itm) =>
        checkedList.some((checked) => checked.currency === itm.currency)
      );

      const newConvertedlist = selectedCurrencyList.map((itm) => ({
        ...itm,
        rate: Number(itm.rate * Number(amt)),
      }));
      console.log("newConvertedlist: ", newConvertedlist);
      setConvertedList(newConvertedlist);
    } else {
      setConvertedList([]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.cardContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Currency Convertor</Text>

          {amt && (
            <Pressable
              style={[styles.resetBtn, { flexDirection: "row", gap: 3 }]}
              onPress={() => {
                setAmt("");

                setCheckedList([]);
                setConvertedList([]);
              }}
            >
              <Ionicons name="refresh" size={18} color={"#FFF"} />
              <Text style={styles.resetText}>Reset</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.stepContainer}>
          <View>
            <Text style={styles.subtitleText}>From</Text>
            <View style={styles.childContainer}>
              <Text style={styles.currencyContainer} disabled>
                MYR
              </Text>

              {/* TOdo: add focus effect */}
              <TextInput
                keyboardType="numeric"
                onChangeText={(text) => {
                  const isValid =
                    /^(0(\.\d{0,4})?|[1-9]\d*(\.\d{0,4})?|(\.\d{0,4})?)?$/.test(
                      text
                    );

                  if (!isValid || !isFinite(Number(text))) {
                    return;
                  }

                  if (Number(text) == 0) {
                    setConvertedList((prev) =>
                      prev.map((item) => ({
                        ...item,
                        rate: 0,
                      }))
                    );
                  }
                  setAmt(text);
                  if (Number(text) > 0) {
                    handleNewRate(text);
                  }
                }}
                value={amt.toString() || ""}
                placeholder="Enter Amount"
                placeholderTextColor="rgba(3, 2, 19, 0.5)"
                style={[styles.amtContainer]}
              ></TextInput>
            </View>
          </View>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              borderColor: "#DCDCDC",
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
            }}
            onPress={() => setIsFocus(!isFocus)}
          >
            {/* TODO: add hover effect */}
            <Ionicons name="add" size={22} color={"black"} />
            <Text style={[styles.currencyText, { textAlign: "center" }]}>
              Add Currencies
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.cardContainer]}>
        {checkedList?.length == 0 ? (
          <View style={{ display: "flex", alignItems: "center", padding: 12 }}>
            <Image
              source={{
                uri: "https://icons.veryicon.com/png/o/education-technology/blue-gray-solid-blend-icon/currency-14.png",
              }}
              style={{ width: 250, height: 250 }}
            />
            <Text style={[styles.titleText, { paddingTop: 12 }]}>
              No currencies selected
            </Text>
          </View>
        ) : (
          <Text style={styles.subtitleText}>Converted Amounts</Text>
        )}

        <FlatList
          data={convertedList}
          renderItem={({ item, index }) => (
            <View style={styles.childContainer} key={index}>
              <Pressable
                style={[
                  styles.currencyContainer,
                  isFocus && styles.currencyContainerFocused,
                ]}
                onPress={() => setIsFocus(!isFocus)}
              >
                <Text style={styles.currencyText}>{item.currency}</Text>
              </Pressable>

              <TextInput
                keyboardType="numeric"
                value={
                  item.rate === 0
                    ? ""
                    : item.currency === "JPY" || item.currency === "IDR"
                    ? item.rate.toFixed(0)
                    : item.rate.toFixed(4)
                }
                // onChangeText={(value) => {
                //   const isValid =
                //     /^(0(\.\d{0,4})?|[1-9]\d*(\.\d{0,4})?|(\.\d{0,4})?)?$/.test(
                //       value
                //     );

                //   if (!isValid) {
                //     window.alert("Special / invalid characters entered.");
                //     setAmt("");
                //     setConvertedAmt("");
                //     return;
                //   }
                //   if (!isFinite(Number(value))) {
                //     window.alert("Amount exceeds the supported limit.");
                //     setAmt("");
                //     setConvertedAmt("");
                //     return;
                //   }
                //   if (Number(value) == 0) {
                //     setAmt("");
                //   }
                //   setConvertedAmt(value);
                //   handleNewBaseRate(value);
                // }}
                editable={false}
                style={[styles.amtContainer, !newRate && styles.disableText]}
              ></TextInput>
            </View>
          )}
          keyExtractor={(item) => item.currency}
          contentContainerStyle={{ marginBottom: 10 }}
          style={{ maxHeight: screenHeight - 350 }}
        />

        {isFocus && (
          <BottomModal
            isFocus={isFocus}
            setIsFocus={setIsFocus}
            setNewRate={setNewRate}
            data={currencyList}
            checkedList={checkedList}
            setCheckedList={setCheckedList}
          />
        )}

        {checkedList?.length > 0 && <Text>Last Updated {lastUpdated}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    padding: 10,
    gap: 8,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderColor: "#DCDCDC",
    margin: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomColor: "#DCDCDC",
    borderBottomWidth: 1,
  },
  titleText: {
    fontSize: 25,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: 500,
  },
  helpfulText: {
    fontWeight: 400,
    fontSize: 18,
    color: "grey",
    textAlign: "center",
    padding: 12,
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
    // paddingHorizontal: 12,
    gap: 15,
  },
  amtContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(236, 236, 240, 0.5)",
    borderRadius: 8,
    // color: "#111827",
    fontSize: 18,
    // width: 200,
    flex: 1,
  },
  currencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    // backgroundColor: "#ececf0",
    backgroundColor: "rgba(236, 236, 240, 0.5)",
    borderRadius: 8,
    color: "#111827",
    fontSize: 18,
    width: 100,
  },
  currencyText: {
    color: "#111827",
    fontSize: 18,
    fontWeight: 500,
  },
  currencyContainerFocused: {
    borderWidth: 2,
    borderColor: "rgba(59,130,246,0.5)",
    shadowColor: "rgba(59,130,246,0.5)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3, // simulate a 3px ring
  },
  disableText: {
    backgroundColor: "rgba(236, 236, 240, 0.5)",
  },
  primaryBtn: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  resetText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  resetBtn: {
    backgroundColor: "red",
    width: 80,
    borderRadius: 10,
    justifyContent: "center",
    padding: 8,
  },
});
