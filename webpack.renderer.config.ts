import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

// Create a separate rules array for renderer that excludes problematic loaders
const rendererRules = rules.filter(rule => {
  // Exclude the asset relocator loader from renderer process
  if (rule && typeof rule === 'object' && 'use' in rule && rule.use && typeof rule.use === 'object' && 'loader' in rule.use) {
    return rule.use.loader !== '@vercel/webpack-asset-relocator-loader';
  }
  return true;
});

rendererRules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules: rendererRules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  // Provide Node.js globals for the renderer process
  node: {
    __dirname: false,
    __filename: false,
  },
};
