// Imports
const {JSDOM} = require('jsdom');
const jquery = require('jquery');

// Constants
const OUTPUT_DELIMETER = ',';
const JISHO_URL_PREFIX = 'https://jisho.org/search/';
const JLPT_REGEX = /N[1-5]/;
const ONLY_KANA_FLAG = 'written using kana alone';
const ERROR_JISHO_CARD = {kanji: "", furi: "", jlpt: "", gram: "", def: "", searchTerm: "", kanaFlag: ""};
const DELAY_MS = 100; // 100ms delay incrementer to avoid 502s from Jisho.org

/**
 * Extracts target data from Jisho.org HTML page given an arbitrary word
 * @param {*} term term searched for using Jisho.org
 * @returns data object containing { kanji, furi, jlpt, gram, def }
 */
async function generateCard(term){
    try{
        let dom = await JSDOM.fromURL(JISHO_URL_PREFIX + term);
        let $ = jquery(dom.window);
        let card = $('#primary div.concept_light:first');
        // Stage 0: Check if term should only be written in Hiragana (prevent Kanji correction)
        let kanaFlagStr = $(card).find('.meaning-wrapper:first .supplemental_info .sense-tag.tag-tag').text().trim().toLowerCase();
        // Stage 1: Kanji
        let kanjiStr = $(card).find('.concept_light-readings:first .text').text().trim();
        // Stage 2: Furigana
        let furigana = [];
        $(card).find('.concept_light-readings:first .furigana').children().each((idx, val) => {
            let text = $(val).text().trim();
            furigana.push(text);
        });
        // Stage 3: JLPT Rating
        let jlptRating = $(card).find('.concept_light-tag:nth-child(2)').text();
        let jlptRegex = jlptRating.match(JLPT_REGEX);
        // Stage 4: Part of Speech
        let grammar = $(card).find('.concept_light-meanings > .meanings-wrapper .meaning-tags:first').text().split(',');
        // Stage 5: English Meaning
        let meaning = $(card).find('.concept_light-meanings > .meanings-wrapper .meaning-wrapper:first .meaning-meaning').text();
        // Stage 6: Assemble Object
        return {
            kanji: kanjiStr,
            furi: furigana,
            jlpt: (jlptRegex ? jlptRegex : ""),
            gram: grammar,
            def: meaning,
            searchTerm: term,
            kanaFlag: (kanaFlagStr.length > 0 ? kanaFlagStr.includes(ONLY_KANA_FLAG) : false),
        };
    } catch (error){
        console.log(`TERM ${term}: ${error}`);
        return ERROR_JISHO_CARD;
    }
}

/**
 * Generate list of card data objects from a given term list
 * @param {*} termList list of N terms passed in from parseTermList()
 * @returns list of card data objects
 */
function generateCardList(termList){
    console.log(`NOW GENERATING: ${termList.length} FLASHCARD DATA OBJECTS`);
    const promises = termList.map((term, idx) => {
        return new Promise((resolve, reject) => setTimeout(resolve, idx * DELAY_MS)).then(() => { 
            console.log(`FLASHCARDS GENERATED: ${idx + 1}/${termList.length}`);
            return generateCard(term)});
    });
    return Promise.all(promises);
}

/**
 * Generate Anki specific furigana string for flashcard formatting
 * @param {*} card 
 * @returns formatted string with kanji[furigana]
 */
function formatFuriStr(card){
    let outputStr = ``;
    let furiList = card.furi;
    let kanjiStr = card.kanji;
    for(let i = 0; i < furiList.length; i++){
        outputStr += kanjiStr.charAt(i);
        if(furiList[i]){
            outputStr += `[${furiList[i]}]`;
        }
    }
    return outputStr;
}

/**
 * ToString() utility function for easily printing card metadata
 * @param {*} card card data object
 * @returns card string
 */
function cardToString(card){
    let kanji = (card.kanaFlag ? card.searchTerm : card.kanji);
    let furi = (card.kanaFlag? kanji : formatFuriStr(card));
    return `${kanji}${OUTPUT_DELIMETER}${furi}${OUTPUT_DELIMETER}${card.gram}${OUTPUT_DELIMETER}${card.def}${OUTPUT_DELIMETER}${card.jlpt}`;
}

module.exports = { generateCardList, cardToString};
