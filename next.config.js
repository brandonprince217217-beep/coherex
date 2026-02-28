/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate"
          },
          {
            key: "Pragma",
            value: "no-cache"
          },
          {
            key: "Expires",
            value: "0"
          }
        ]
      },
      {
        // Video files need caching + byte-range support for browsers to buffer and seek
        source: "/:path*\\.(mp4|webm|ogg|mov)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000"
          },
          {
            key: "Accept-Ranges",
            value: "bytes"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
