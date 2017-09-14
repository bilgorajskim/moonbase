const path = require('path')
const process = require('process')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin('[name].[hash].css')
const ManifestPlugin = require('webpack-manifest-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  }),
  extractCSS,
  new webpack.optimize.CommonsChunkPlugin('commons'),
  new ManifestPlugin({
    fileName: './../mix-manifest.json',
    basePath: '/assets/'
  }),
  new CleanWebpackPlugin(['dist'], {
    root: __dirname,
    verbose: true,
    dry: false
  }),
  new HtmlWebpackPlugin({
    title: 'Moonbase',
    template: path.join('src', 'template.html'),
    inject: 'body'
  }),
  new webpack.ProvidePlugin({
    THREE: 'three'
  })
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  )
}

module.exports = {
  entry: path.resolve(__dirname, 'src', 'app.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/')
    }
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /(\.js|\.jsx)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, './node_modules/react-icons/fa'), path.resolve(__dirname, './node_modules/react-icons/go')]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.css/i,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.scss$/i,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.less/i,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.styl/i,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'stylus-loader']
        })
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-source-map',
  plugins,
  externals: [
    'jsdom', 'fs', 'xmldom'
  ],
  devServer: {
    proxy: {
      '/api': 'http://localhost:2580'
    }
  }
}
