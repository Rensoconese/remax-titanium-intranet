/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly WORDPRESS_API_URL: string;
  readonly WORDPRESS_USERNAME: string;
  readonly WORDPRESS_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
