const axios = require('axios').default;
const entries = require('./getData');
console.log(entries);

const postBlog = async entries => { // さっき取得したエントリ情報を引数に
  const title = `${new Date().toLocaleDateString()}の退職エントリ`;
  let content = '';
  for (const entry of entries) {
    if (content !== '') {
      content += '\r\n';
    }
    content += `[${entry.url}:embed:cite]`; // はてなのカード形式で出るようにする。
  }
  if (content === '') {
    return;
  }
  const data = `<?xml version="1.0" encoding="utf-8"?>
  <entry xmlns="http://www.w3.org/2005/Atom"
         xmlns:app="http://www.w3.org/2007/app">
    <title>${title}</title>
    <content type="text/x-markdown">
      ${content}
    </content>
  </entry>`;

  await axios.post(
    'https://blog.hatena.ne.jp/{はてなID}/{ブログID}/atom/entry',
    data,
    // { auth: { username: /* はてなID */, password: /* APIキー */ } }
  );
};

