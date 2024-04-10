/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/crawlTable",
        permanent: true
      }
    ]
  }
};

export default nextConfig;
