import type { Configuration } from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { rules } from './webpack.rules'
import { plugins } from './webpack.plugins'

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
})

// @ts-ignore
plugins.push(
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'src/*.css',
        to: '[name][ext]',
      },
    ],
  })
)

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
}
