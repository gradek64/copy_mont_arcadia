const requestsWithBodies = [
  'post',
  'put',
  'patch',
  'delete',
  'options',
  'link',
  'unlink',
  'lock',
  'propfind',
  'view',
]

const deviceTypes = {
  apps: 'apps',
  desktop: 'desktop',
  mobile: 'mobile',
  mobileWcs: 'true',
  tablet: 'tablet',
}

// Collection of user agents associated with bots for which we do
// not want to generate session keys / Redis entries
// in order to save memory usage on Redis Session store.
const userAgentsNoSession = [
  'Mozilla/5.0 (compatible; Pinterestbot/1.0; +http://www.pinterest.com/bot.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 (compatible; AhrefsBot/6.1; +http://ahrefs.com/robot/)',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Ayima-Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; SemrushBot/6~bl; +http://www.semrush.com/bot.html)',
  'Mozilla/5.0(Linux;Android 5.1.1;OPPO A33 Build/LMY47V;wv) AppleWebKit/537.36(KHTML,link Gecko) Version/4.0 Chrome/43.0.2357.121 Mobile Safari/537.36 LieBaoFast/4.51.3',
  'Mozilla/5.0(Linux;U;Android 5.1.1;zh-CN;OPPO A33 Build/LMY47V) AppleWebKit/537.36(KHTML,like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.7.0.953 Mobile Safari/537.36',
  'Mozilla/5.0(Linux;Android 5.1.1;OPPO A33 Build/LMY47V;wv) AppleWebKit/537.36(KHTML,link Gecko) Version/4.0 Chrome/42.0.2311.138 Mobile Safari/537.36 Mb2345Browser/9.0',
  'Mozilla/5.0 (Linux; Android 7.0; FRD-AL00 Build/HUAWEIFRD-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043602 Safari/537.36 MicroMessenger/6.5.16.1120 NetType/WIFI Language/zh_CN',
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Ayima-SEO-Agency-Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
  'Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)',
  'WGSN;+44 207 516 5099;datacollection@wgsn.com',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Applebot/0.1; +http://www.apple.com/go/applebot)',
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Mozilla/5.0 (compatible; SemrushBot/6~bl; +http://www.semrush.com/bot.html)',
  'Mozilla/5.0 (compatible; DotBot/1.1; http://www.opensiteexplorer.org/dotbot, help@moz.com)',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)',
  'AdsBot-Google (+http://www.google.com/adsbot.html)',
  'Mozilla/5.0 (compatible; MegaIndex.ru/2.0; +http://megaindex.com/crawler)',
]

export { requestsWithBodies, deviceTypes, userAgentsNoSession }
