const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
  require("dotenv").config({
    path: ".env",
  });

  let config = {
    entry: "./src/client/index.tsx",
    devtool: "inline-source-map",
    mode: "development",
    output: {
      path: path.join(__dirname, "dev/assets/javascript"),
      filename: "app.js",
    },
    resolve: {
      extensions: [".Webpack.js", ".web.js", ".ts", ".js", ".jsx", ".tsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "ts-loader",
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.MEME_PATH": JSON.stringify(process.env.MEME_PATH),
        "process.env.TWITCH_USERNAME": JSON.stringify(process.env.TWITCH_USERNAME),
        "process.env.TWITCH_CUSTOM_REWARD_ID": JSON.stringify(process.env.TWITCH_CUSTOM_REWARD_ID),
        "process.env.VERSION": JSON.stringify(require("./package.json").version),
      }),
    ],
  };

  if (env.environment == "production") {
    config["mode"] = "production";
    config["devtool"] = false;
    config["output"]["path"] = path.join(__dirname, "dist/assets/javascript");
  }

  return config;
};
