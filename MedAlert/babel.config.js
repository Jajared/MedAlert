module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "@babel/preset-typescript", ["@babel/preset-env", { targets: { node: "current" } }]],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
        },
      ],
    ],
  };
};
