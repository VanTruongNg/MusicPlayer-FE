/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'nestjs-musicplayer.s3.ap-southeast-2.amazonaws.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: '**',
            port: '',
            pathname: '/**',
          },
        ],
      },
    compiler: {
        styledComponents: true
    },
    webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          use: ["@svgr/webpack"]
        });
        return config;
    }
};

export default nextConfig;
