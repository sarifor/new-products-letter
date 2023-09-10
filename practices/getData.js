const client = require('cheerio-httpcli');

// "退職しました"を検索する。"&tbs=qdr:d"を付与すると24時間以内の検索になる。
const BASE_URL_GOOGLE =
  'https://www.google.com/search?q=%22%E9%80%80%E8%81%B7%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F%22&tbs=qdr:d&start=';

// はてブなど、除外したいサイトを登録しておく。
const IGNORE_SITES = [
  'https://b.hatena.ne.jp/',
  'https://newstopics.jp/',
];

// 退職エントリとみなすキーワードを持たせておく。
const RETIREMENT_WORDS = ['退職します', '退職しました'];

const includesIgnoreSites = value => IGNORE_SITES.some(_ => value.includes(_));

const includesRetirementWords = value =>
  RETIREMENT_WORDS.some(_ => value.includes(_));

const getEntries = async () => {
  const retirementEntries = [];
  for (let i = 0; ; i += 10) { // 検索結果10件ずつを取得
    const res = await client.fetch(`${BASE_URL_GOOGLE}${i}`);
    console.log(res.response.statusCode);
    const contents = res.$('a > h3');
    if (contents.length === 0) {
      // 検索結果が無くなったら終わり
      break;
    }
    contents.each((index, elm) => {
      const url = elm.parent.attribs.href;
      const title = elm.childNodes[0].data;
      if (!title) {
        return;
      }
      if (!includesIgnoreSites(url) && includesRetirementWords(title)) {
        retirementEntries.push({ url: url, title: title });
      }
    });
  }
  return retirementEntries;
};

getEntries().then(entries => console.log(entries)).catch(error => console.error(error));

module.exports = entries;