const path = require('path')
const sassGlobals = [
  path.join(__dirname, '../src/_sass_shared/_theme.scss')
]
module.exports = {
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
  stories: [path.join(__dirname, '../src/dicts/dicts.stories.tsx').replace(/\\/g, '/')],
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        "style-loader",
        // Translates CSS into CommonJS
        {
          loader: "css-loader",
          // options: {
          //   modules: {
          //     mode: "local",
          //     localIdentName: "eudic-[local]--[hash:base64:5]",
          //   },
          //   sourceMap: process.env.NODE_ENV === 'development',
          // },
        },
        // Compiles Sass to CSS
        "sass-loader",
        {
          loader: 'sass-resources-loader',
          options: {
            sourceMap: true,
            resources: sassGlobals
          }
        }
      ],
    });
    config.module.rules.push({
      test: /\.html$/,
      use: 'raw-loader',
    });
    config.resolve.alias['@'] = path.join(__dirname, '../src')
    return config
  },
}