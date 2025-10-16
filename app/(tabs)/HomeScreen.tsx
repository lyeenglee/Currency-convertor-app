import PrimaryBtn from "@/components/buttons/PrimaryBtn";
import Divider from "@/components/common/Divider";
import BottomModal from "@/components/modals/BottomModal";
import { getAllRating } from "@/services/currencyService";
import { mapCurrencyToCountry } from "@/utils/currencyMapper";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import getSymbolFromCurrency from "currency-symbol-map";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
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

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [newRate, setNewRate] = useState<string>("");
  const [currencyList, setCurrencyList] = useState<CurrencyRate[]>([]); //after paginate
  const [allCurrencyList, setAllCurrnecyList] = useState<CurrencyRate[]>([]);
  const [convertedList, setConvertedList] = useState<CurrencyRate[]>([]);
  const [checkedList, setCheckedList] = useState<CheckedRate[]>([]);
  const [amt, setAmt] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const PAGE_SIZE = 25;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    handleNewRate(amt);
  }, [amt, checkedList]);

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  useEffect(() => {
    if (page === 1 || !hasMore) {
      return;
    }
  }, [page]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;

    if (currencyList.length >= allCurrencyList.length) {
      setHasMore(false);
      setLoading(false);
      return;
    }
    const newData = allCurrencyList.slice(
      PAGE_SIZE * (page - 1),
      PAGE_SIZE * page
    );
    setCurrencyList((prev) => [...prev, ...newData]);

    setPage(nextPage);
  };

  const fetchCurrencyRates = async (page = 1) => {
    setLoading(true);
    const res = await getAllRating();
    if (res) {
      const { filteredCurrencyList, formattedLastUpdated } = res;
      setAllCurrnecyList(filteredCurrencyList);

      setLastUpdated(formattedLastUpdated);
    }

    setLoading(false);
  };

  const handleNewRate = (amt: string) => {
    if (checkedList?.length > 0) {
      const selectedCurrencyList = currencyList?.filter((itm) =>
        checkedList.some((checked) => checked.currency === itm.currency)
      );

      const newConvertedlist = selectedCurrencyList?.map((itm) => ({
        ...itm,
        rate: Number(itm.rate * Number(amt)),
      }));

      setConvertedList(newConvertedlist);
    } else {
      setConvertedList([]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Pressable onPress={() => Keyboard.dismiss()}>
        <View style={styles.cardContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Currency Convertor</Text>
            {amt && (
              <PrimaryBtn
                title="Reset"
                iconName="refresh"
                iconColor="#FFF"
                iconSize={18}
                onPress={() => {
                  setAmt("");
                  setCheckedList([]);
                  setConvertedList([]);
                }}
                containerStyle={styles.resetBtn}
                textStyle={styles.resetText}
              />
            )}
          </View>
          <Divider />
          <View style={styles.stepContainer}>
            <View>
              <Text style={styles.subtitleText}>From</Text>
              <View style={styles.childContainer}>
                <Text
                  style={[styles.currencyContainer, styles.greyBg]}
                  disabled
                >
                  MYR
                </Text>

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
                  style={[styles.amtContainer, styles.greyBg]}
                ></TextInput>
              </View>
            </View>

            <PrimaryBtn
              title="Add Currencies"
              iconName="add"
              iconColor="black"
              iconSize={22}
              onPress={() => setIsFocus(!isFocus)}
              containerStyle={styles.secondaryBtn}
              textStyle={[styles.currencyText, { textAlign: "center" }]}
            />
          </View>
        </View>

        <View style={[styles.cardContainer]}>
          {checkedList?.length == 0 ? (
            <View style={styles.noResultContainer}>
              <Image
                source={{
                  uri: "https://icons.veryicon.com/png/o/education-technology/blue-gray-solid-blend-icon/currency-14.png",
                }}
                style={{ width: 250, height: 250 }}
              />
              <Text style={{ paddingTop: 12, fontSize: 18 }}>
                No currencies selected
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.subtitleText}>Converted Amounts</Text>
              <Text style={[styles.subtitleText, { color: "grey" }]}>
                {Number(amt).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}{" "}
                MYR equals
              </Text>
            </>
          )}

          <FlatList
            bounces={false}
            data={convertedList}
            renderItem={({ item, index }) => {
              const selected =
                mapCurrencyToCountry.find(
                  (itm) => itm.currency === item.currency
                )?.country || "";
              return (
                <View style={{ paddingHorizontal: 10 }}>
                  <View
                    style={[
                      styles.childContainer,
                      styles.currencyItemContainer,
                    ]}
                    key={index}
                  >
                    <Pressable style={[styles.currencyContainer]}>
                      <Text style={styles.currencyText}>
                        {getUnicodeFlagIcon(selected)}
                      </Text>

                      <Text style={styles.currencyText}>{item.currency}</Text>
                    </Pressable>

                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      bounces={false}
                    >
                      <TextInput
                        keyboardType="numeric"
                        value={
                          item.rate === 0
                            ? ""
                            : `${getSymbolFromCurrency(item.currency)} ${
                                item.currency === "JPY" ||
                                item.currency === "IDR"
                                  ? item.rate.toLocaleString("en-US", {
                                      maximumFractionDigits: 0,
                                    })
                                  : item.rate.toLocaleString("en-US", {
                                      minimumFractionDigits: 4,
                                      maximumFractionDigits: 4,
                                    })
                              }`
                        }
                        editable={false}
                        multiline={false}
                        scrollEnabled={false}
                        style={[styles.amtContainer]}
                      ></TextInput>
                    </ScrollView>

                    <PrimaryBtn
                      iconName="close-sharp"
                      iconColor="black"
                      iconSize={22}
                      onPress={() =>
                        setCheckedList((prev) =>
                          prev.filter((itm) => itm.currency !== item.currency)
                        )
                      }
                      containerStyle={{ paddingRight: 10, paddingVertical: 10 }}
                    />
                  </View>
                  {index !== convertedList.length - 1 && <Divider />}
                </View>
              );
            }}
            keyExtractor={(item) => item.currency}
            contentContainerStyle={{ marginBottom: 10 }}
            style={{ maxHeight: screenHeight - 440 }}
          />

          {isFocus && (
            <BottomModal
              isFocus={isFocus}
              setIsFocus={setIsFocus}
              data={currencyList}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
              handleLoadMore={handleLoadMore}
              loading={loading}
            />
          )}

          {checkedList?.length > 0 && <Text>Last Updated {lastUpdated}</Text>}
        </View>
      </Pressable>
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
    paddingBottom: 5,
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
    gap: 15,
  },
  amtContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 18,
    overflowX: "visible",
    flex: 1,
  },
  currencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    color: "#111827",
    fontSize: 18,
    width: 90,
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
    shadowRadius: 3,
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
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderColor: "#DCDCDC",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
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
    flexDirection: "row",
    gap: 3,
  },
  greyBg: {
    backgroundColor: "rgba(236, 236, 240, 0.5)",
  },
  noResultContainer: {
    display: "flex",
    alignItems: "center",
    padding: 12,
  },
  currencyItemContainer: {
    backgroundColor: "rgba(236, 236, 240, 0.5)",
    marginVertical: 10,
    borderRadius: 8,
  },
});
