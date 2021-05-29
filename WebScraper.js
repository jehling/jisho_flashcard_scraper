// Imports
const {JSDOM, VirtualConsole} = require('jsdom');
const jquery = require('jquery');

// Constants
const JISHO_URL_PREFIX = 'https://jisho.org/search/';

async function getJishoCard(kanjiStr){
    let dom = await JSDOM.fromURL(JISHO_URL_PREFIX + kanjiStr);
    let $ = jquery(dom.window);
    let card = $('#primary div.concept_light:first');
    // Stage 1: Furigana
    let furigana = [];
    $(card).find('.furigana').contents().each((idx, val) => {
        let text = $(val).text();
        if(text.trim().length > 0) furigana.push(text);
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
        jlpt: jlptRating,
        gram: grammar,
        def: meaning,
    };
}

getJishoCard("英語").then(output => console.log(output));