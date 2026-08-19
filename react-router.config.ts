import type { Config } from '@react-router/dev/config';
import { blogPosts } from './src/data/blogPosts';
import { blogCategories } from './src/data/blogCategories';
import { portfolioProjects } from './src/data/portfolioProjects';

export default {
  appDirectory: 'src',
  buildDirectory: 'dist',
  // ssr:true retry (Sub-step 2A retry): the ssr:false static-prerender path
  // produced silently empty output for any component using <Link>/useLocation/
  // useNavigate — a documented, still-being-ironed-out weakness of RR v7's
  // ssr:false Framework Mode (see PHASE_2A_REPORT.md / remix-run/react-router
  // discussion #12360). ssr:true routes through the mature SSR codepath at
  // build time; with every served route in `prerender`, the deploy output is
  // still 100% static files — same end architecture, more reliable codepath.
  ssr: true,
  // Disable lazy route discovery: it expects a live `/__manifest` endpoint,
  // which doesn't exist for a static prerendered site.
  routeDiscovery: { mode: 'initial' },
  // Sub-step 2C: every marketing route is covered. `getStaticPaths()` covers
  // every non-dynamic route() entry in routes.ts automatically; blog post and
  // category paths are computed from the same data arrays the pages
  // themselves read, so a new blog post/category prerenders automatically
  // with no config edit. /portal/* is never added here (client-only, per
  // Phase 1's robots.txt Disallow) — it has no route() entry in routes.ts at
  // all, so getStaticPaths() can't and won't include it.
  prerender: async ({ getStaticPaths }) => {
    const blogPostPaths = blogPosts.map((post) => `/blog/${post.slug}`);
    const blogCategoryPaths = blogCategories.map((category) => `/blog/category/${category.slug}`);
    const portfolioPaths = portfolioProjects.map((project) => `/portfolio/${project.slug}`);
    return [...getStaticPaths(), ...blogPostPaths, ...blogCategoryPaths, ...portfolioPaths];
  },
} satisfies Config;
