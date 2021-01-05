const fetch = require('node-fetch');
const fs = require('fs/promises');

const main = async () => {
    const res = await fetch('https://www.tut.ac.jp/info/corona/katudo.html');
    const data = await res.text();
    const endemicArea = /<li>流行地域<\/li>\n<\/ul>\n<ul class="linklist-s">\n<li>(.*)<\/li>/.exec(data);
    if (endemicArea.length !== 2) {
        throw 'response data error';
    }

    const areaList = endemicArea[1].split('、');
    const timestamp = (new Date()).toLocaleString();
    await fs.writeFile('./data/endemic-area.json', JSON.stringify({
        area: areaList,
        timestamp: timestamp
    }));
    console.info(`wrote new file.\ntimestamp: ${timestamp}\nendemic area count: ${areaList.length}`);
};

main();