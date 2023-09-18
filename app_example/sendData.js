require('dotenv').config();
const axios = require('axios').default;
const getEntries = require('./getData');

getEntries().then(entries => {
  if (Array.isArray(entries) && entries.length > 0) {
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
      /* const data = `<?xml version="1.0" encoding="utf-8"?>
      <entry xmlns="http://www.w3.org/2005/Atom"
             xmlns:app="http://www.w3.org/2007/app">
        <title>${title}</title>
        <content type="text/x-markdown">
          ${content}
        </content>
      </entry>`; */

      const data = `<?xml version="1.0" encoding="utf-8"?>
      <entry xmlns="http://www.w3.org/2005/Atom"
             xmlns:app="http://www.w3.org/2007/app">
        <title>posting test</title>
        <content type="text/x-markdown">
          posting test
        </content>
      </entry>`;

      const username = process.env.BLOG_ID;
      const password = process.env.PASSWORD;

      await axios.post(
        'https://blog.hatena.ne.jp/murunpiyo/mylittlepj.hatenablog.com/atom/entry',
        data,
        { 
          auth: {
            username,
            password,
          },
        }
      );
    };
    postBlog(entries);
    console.log("Posted");
  } else {
    console.log("Cannot get data")
  }
}).catch(
  error => console.error(error)
);