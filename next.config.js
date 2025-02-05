/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import withMDXBase from "@next/mdx";
// next.config.js
const withMDX = withMDXBase({
  // Optionally provide remark and rehype plugins
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Optionally, add any other Next.js config below
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "utfs.io" }],
  },
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: "/game",
          destination: "http://5.161.61.70:3000/", // Matched parameters can be used in the destination
        },
      ],
      afterFiles: [
        {
          source: "/game",
          destination: "http://5.161.61.70:3000/",
        },
      ],
      fallback: [
        {
          source: "/game",
          destination: "http://5.161.61.70:3000/",
        },
      ],
    };
  },
};

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
