import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // PDF 파일을 위한 로더 설정
    config.module.rules.push({
      test: /\.pdf$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/_next/static/files',
          outputPath: 'static/files',
        },
      },
    });
    return config;
  },
};

export default nextConfig;