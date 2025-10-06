import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

type PrimaryBtnProps = {
  title?: string;
  iconName: string;
  iconColor?: string;
  iconSize?: number;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};
export default function PrimaryBtn({
  title,
  iconName,
  iconColor,
  iconSize,
  onPress,
  containerStyle,
  textStyle,
}: PrimaryBtnProps) {
  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
      {title && <Text style={textStyle}>{title}</Text>}
    </Pressable>
  );
}
