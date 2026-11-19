import { defineMiddleware } from "astro:middleware";
import { WORDPRESS_URL } from 'astro:env/server';

const BLOCKED_UAS = ["facebook", "google", "meta", "bot", "spider", "crawler", "crawl", "scrape", "scraping", "harvest", "extract", "parser", "indexer", "indexing", "archiver", "archive", "wayback", "fetcher", "grabber", "scan", "scanner", "scanning", "probe", "recon", "fingerprint", "fuzzer", "fuzz", "headless", "headlesschrome", "phantomjs", "selenium", "puppeteer", "playwright", "webdriver", "chromedriver", "googlebot", "adsbot-google", "mediapartners-google", "feedfetcher-google", "google-read-aloud", "duplexweb-google", "apis-google", "googleother", "google-extended", "googleinspectiontool", "bingbot", "msnbot", "adidxbot", "applebot", "slurp", "duckduckbot", "baiduspider", "yandex", "yandexbot", "sogou", "sogou web spider", "seznambot", "petalbot", "bytespider", "qwantify", "exabot", "ia_archiver", "archive.org", "heritrix", "ahrefs", "ahrefsbot", "semrush", "semrushbot", "mj12", "mj12bot", "dotbot", "blexbot", "megaindex", "serpstat", "serpstatbot", "linkdex", "linkdexbot", "sistrix", "seokicks", "openindexspider", "rogerbot", "sitebulb", "screaming frog", "cocolyze", "onpage", "crawlera", "facebookexternalhit", "facebot", "meta-externalagent", "meta-externalfetcher", "meta-external", "twitterbot", "linkedinbot", "slackbot", "discordbot", "telegrambot", "whatsapp", "skypeuripreview", "pinterest", "gptbot", "chatgpt", "openai", "gpt", "claude", "anthropic", "cohere", "perplexity", "you.com", "youbot", "kagi", "commoncrawl", "ccbot", "omgili", "diffbot", "curl", "libcurl", "wget", "httpie", "postman", "postmanruntime", "insomnia", "python", "python-requests", "requests", "urllib", "urllib3", "aiohttp", "scrapy", "libwww", "libwww-perl", "lwp", "mechanize", "java", "okhttp", "apache-httpclient", "httpclient", "http-client", "go-http-client", "node-fetch", "undici", "axios", "fetch", "got", "guzzle", "php", "ruby", "perl", "powershell", "restsharp", "winhttp", "nmap", "masscan", "zmap", "zgrab", "nikto", "sqlmap", "w3af", "hydra", "acunetix", "netsparker", "nessus", "openvas", "zaproxy", "owasp zap", "burp", "burpsuite", "arachni", "wapiti", "skipfish", "whatweb", "wpscan", "gobuster", "dirb", "dirbuster", "ffuf", "feroxbuster", "nuclei", "pingdom", "uptimerobot", "statuscake", "site24x7", "datadog", "newrelic", "nagios", "zabbix"];

export const onRequest = defineMiddleware((context, next) => {

  const userAgent = context.request.headers.get('user-agent') || '';
  const isBlockedUA = BLOCKED_UAS.some(ua => userAgent.toLowerCase().includes(ua.toLowerCase()));

  if (isBlockedUA) {
    return next();
  }
  else {
    const { pathname, searchParams } = context.url;
    let cleanPath = pathname;
    if (cleanPath.startsWith('/http://') || cleanPath.startsWith('/https://')) {
      cleanPath = cleanPath.replace(/^\/https?:\/\/[^\/]+/, '') || '/';
    }

    let cleanWpUrl = (WORDPRESS_URL || 'https://st.melyweb.net').trim().replace(/\/+$/, '');
    const duplicateMatch = cleanWpUrl.match(/^(https?:\/\/[^\/]+)\/https?:\/\/[^\/]+/);
    if (duplicateMatch) {
      cleanWpUrl = duplicateMatch[1];
    }

    const search = searchParams.toString();
    const query = search ? `?${search}` : '';
    const newUrl = `${cleanWpUrl}${cleanPath === '/' ? '/' : cleanPath}${query}`;
    const response = context.redirect(newUrl, 307);
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  }
});
