import { CheckedRate, CurrencyRate } from "@/app/(tabs)/HomeScreen";
import { mapCurrencyToCountry } from "@/utils/currencyMapper";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import PrimaryBtn from "../buttons/PrimaryBtn";
import RateItem from "../lists/RateItem";

type ModalProps = {
  isFocus: boolean;
  data: CurrencyRate[];
  checkedList: CheckedRate[];
  setIsFocus: React.Dispatch<React.SetStateAction<boolean>>;
  setCheckedList: React.Dispatch<React.SetStateAction<CheckedRate[]>>;
};

export default function BottomModal({
  isFocus,
  setIsFocus,
  data,
  checkedList,
  setCheckedList,
}: ModalProps) {
  const insets = useSafeAreaInsets();

  const onSelectCurrency = (currency: string) => {
    const existing = checkedList.some((item) => item.currency === currency);
    setCheckedList((prev) =>
      existing
        ? prev.filter((item) => item.currency !== currency)
        : [...prev, { currency }]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFocus}
      onRequestClose={() => {
        setIsFocus(false);
      }}
    >
      <SafeAreaView style={styles.container}>
        <Pressable onPress={() => setIsFocus(false)} style={styles.overlay} />
        <View style={styles.bottomSheet}>
          <View
            style={[
              styles.titleContainer,
              { justifyContent: "space-between", paddingBottom: 5 },
            ]}
          >
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.dropDownHeader}>Select Currencies</Text>
              <Text
                style={{
                  fontWeight: 400,
                  fontSize: 18,
                  color: "grey",
                  textAlign: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                }}
              >
                Choose currencies to convert
              </Text>
            </View>

            <PrimaryBtn
              iconName="close-outline"
              iconColor="black"
              iconSize={25}
              onPress={() => setIsFocus(false)}
            />
          </View>
          <View>
            <FlatList
              data={data}
              renderItem={({ item, index }) => {
                const isChecked = checkedList.some(
                  (checked) => item.currency === checked.currency
                );

                const selected =
                  mapCurrencyToCountry.find(
                    (itm) => itm.currency === item.currency
                  )?.country || "";

                return (
                  <RateItem
                    currency={item.currency}
                    rate={item.rate}
                    onChange={() => onSelectCurrency(item.currency)}
                    isChecked={isChecked}
                    selected={selected}
                  />
                );
              }}
              keyExtractor={(item) => item.currency}
              contentContainerStyle={{ paddingBottom: 45 + insets.bottom }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    gap: 8,
  },
  dropDownHeader: {
    fontSize: 18,
    fontWeight: 500,
    paddingHorizontal: 12,
  },
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    height: "75%",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#DCDCDC",
    shadowColor: "grey",
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
