const path = require('path');

module.exports = {
    entry: "./script.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      port: 8080,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
          ],
        },
  
        /* babel loader */
        {
          test: /\.js$/,
          exclude: "/node_modules/",
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          ],
        },
      ],
    },
    plugins: [
      /* HTML Webpack Plugin */
      new HtmlWebpackPlugin({
        template: "./src/template.html",
        filename: "index.html",
      }),
    ],
  };
