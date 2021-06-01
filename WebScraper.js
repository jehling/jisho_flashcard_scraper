// Imports
const {JSDOM} = require('jsdom');
const jquery = require('jquery');
const fs = require('fs');

// Constants
const JISHO_URL_PREFIX = 'https://jisho.org/search/';
const INPUT_DELIMETER = '\n';
const JLPT_REGEX = /N[1-5]/;

async function getJishoCard(kanjiStr){
    let dom = await JSDOM.fromURL(JISHO_URL_PREFIX + kanjiStr);
    let $ = jquery(dom.window);
    let card = $('#primary div.concept_light:first');
    // Stage 1: Furigana
    let furigana = [];
    $(card).find('.concept_light-readings:first .furigana').children().each((idx, val) => {
        let text = $(val).text().trim();
        furigana.push(text);
    });
    // Stage 2: JLPT Rating
    let jlptRating = $(card).find('.concept_light-tag:nth-child(2)').text();
    // Stage 3: Part of Speech
    let grammar = $(card).find('.concept_light-meanings > .meanings-wrapper .meaning-tags:first').text().split(',');
    // Stage 4: English Meaning
    let meaning = $(card).find('.concept_light-meanings > .meanings-wrapper .meaning-wrapper:first .meaning-meaning').text();
    // Stage 5: Assemble Object
    return {
        kanji: kanjiStr,
        furi: furigana,
        jlpt: (jlptRating ? jlptRating.match(JLPT_REGEX)[0] : jlptRating),
        gram: grammar,
        def: meaning,
    };
}

function parseTermList(file){
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, buffer) => {
            if(err) return reject(err);
            let rawArray = buffer.toString().split(INPUT_DELIMETER);
            let cleanArray = [];
            rawArray.forEach(term => cleanArray.push(term.trim()));
            return resolve(cleanArray);
        });
    });
}

function getCardList(termList){
    let cardList = [];
    termList.forEach(term => {
        cardList.push(getJishoCard(term));
    });
    return Promise.all(cardList);
}

parseTermList('./terms.txt').then(getCardList).then(cards => console.log(cards));