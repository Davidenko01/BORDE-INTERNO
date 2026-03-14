const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Aquí conectamos NativeWind con tu archivo CSS global
module.exports = withNativeWind(config, { input: "./global.css" });