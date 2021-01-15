const fetch = require('node-fetch');
const fs = require('fs/promises');

const PREFECTURE_LIST = [
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県'
];

const main = async () => {
    const res = await fetch('https://www.tut.ac.jp/info/corona/katudo.html');
    const data = await res.text();

    if (/<p class="box-midashi" id="ryuko">流行地域について<span class="newicon-text">更新・最終更新日.*<\/span><\/p>/.test(data)) {
        const endemicArea = /<li>緊急事態宣言対象地域 ＝ 原則，出張・旅行・移動の禁止<\/li>\n<\/ul>\n<ul class="linklist-s">\n<li>(.*)<br>※上記以外の地域への出張・旅行・移動は自粛を求めております。<\/li>/.exec(data);
        if (endemicArea.length !== 2) {
            throw 'response data error';
        }

        const areaList = endemicArea[1].split('、');

        const timestamp = (new Date()).toLocaleString();
        await fs.writeFile('./data/endemic-area.json', JSON.stringify({
            area: areaList,
            timestamp: timestamp,
            isDeclaresStateOfEmergency: true
        }));
        console.info(`wrote new file.\ntimestamp: ${timestamp}\nendemic area count: ${areaList.length}`);
    } else {
        const endemicArea = /<li>流行地域<\/li>\n<\/ul>\n<ul class="linklist-s">\n<li>(.*)<\/li>/.exec(data);
        if (endemicArea.length !== 2) {
            throw 'response data error';
        }

        const endemicAreaText = endemicArea[1];

        const isExcept = /.*を除く都道府県$/.test(endemicAreaText);

        let areaList = [];
        if (isExcept) {
            const exceptPref = areaList = endemicArea[1].replace('を除く都道府県', '').split('、');
            areaList = PREFECTURE_LIST.filter(p => !exceptPref.includes(p));

        } else {
            areaList = endemicArea[1].split('、');
        }

        const timestamp = (new Date()).toLocaleString();
        await fs.writeFile('./data/endemic-area.json', JSON.stringify({
            area: areaList,
            timestamp: timestamp,
            isDeclaresStateOfEmergency: false
        }));
        console.info(`wrote new file.\ntimestamp: ${timestamp}\nendemic area count: ${areaList.length}`);
    }
};

main();