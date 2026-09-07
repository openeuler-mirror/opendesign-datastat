/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2026. All rights reserved. 
 */

import nodePath from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const STATIC_ROUTES = [
  '/zh/overview',
  '/zh/detail',
  '/zh/company',
  '/zh/sig',
  '/zh/user',
  '/zh/mobile',
  '/zh/mobile/company',
  '/zh/mobile/sig',
  '/zh/mobile/about',
  '/zh/about',
  '/zh/mobile/user',
  '/en/overview',
  '/en/detail',
  '/en/company',
  '/en/sig',
  '/en/user',
  '/en/mobile',
  '/en/mobile/company',
  '/en/mobile/sig',
  '/en/about',
  '/en/mobile/about',
  '/en/mobile/user',
];

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return char;
    }
  });
}

function buildSitemapXml(origins, routes) {
  const urls = [];
  for (const origin of origins) {
    for (const route of routes) {
      urls.push(
        [
          '  <url>',
          `    <loc>${escapeXml(`${origin}${route}`)}</loc>`,
          '  </url>',
        ].join('\n'),
      );
    }
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls.join('\n'),
    '</urlset>',
    '',
  ].join('\n');
}

function buildRobotsTxt(origins) {
  const sitemaps = origins.map((origin) => `Sitemap: ${origin}/sitemap.xml`).join('\n');
  return ['User-agent: *', 'Allow: /', '', sitemaps, ''].join('\n');
}

export default function sitemapPlugin(options = {}) {
  const routes = options.routes ?? STATIC_ROUTES;
  const origins = (options.origins ?? [])
    .filter(Boolean)
    .map((origin) => origin.replace(/\/+$/, ''));
  let outDir = '';

  return {
    name: 'euler:sitemap',
    apply: 'build',
    configResolved(config) {
      const rawOutDir = config.build.outDir;
      outDir = nodePath.isAbsolute(rawOutDir)
        ? rawOutDir
        : nodePath.resolve(config.root, rawOutDir);
    },
    async closeBundle() {
      if (origins.length === 0) {
        this.warn('sitemap: no origins configured; skipping sitemap.xml and robots.txt generation.');
        return;
      }
      await mkdir(outDir, { recursive: true });
      await Promise.all([
        writeFile(nodePath.join(outDir, 'sitemap.xml'), buildSitemapXml(origins, routes), 'utf8'),
        writeFile(nodePath.join(outDir, 'robots.txt'), buildRobotsTxt(origins), 'utf8'),
      ]);
      this.info(`sitemap: generated sitemap.xml and robots.txt for ${origins.length} origin(s).`);
    },
  };
}
