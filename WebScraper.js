// Imports
const {JSDOM} = require('jsdom');
const jquery = require('jquery');
const fs = require('fs');

// Constants
const JISHO_URL_PREFIX = 'https://jisho.org/search/';
const INPUT_DELIMETER = '\n';
const OUTPUT_DELIMETER = '\t';
const OUTPUT_DIR = './output_dir/';
const JLPT_REGEX = /N[1-5]/;

/**
 * Extracts target data from Jisho.org HTML page given an arbitrary word
 * @param {*} term term searched for using Jisho.org
 * @returns data object containing { kanji, furi, jlpt, gram, def }
 */
async function getJishoCard(term){
    let dom = await JSDOM.fromURL(JISHO_URL_PREFIX + term);
    let $ = jquery(dom.window);
    let card = $('#primary div.concept_light:first');
    // Stage 0: Kanji
    let kanjiStr = $(card).find('.concept_light-readings:first .text').text().trim();
    // Stage 1: Furigana
    let furigana = [];
    $(card).find('.concept_light-readings:first .furigana').children().each((idx, val) => {
        let text = $(val).text().trim();
        furigana.push(text);
    });
    // Stage 2: JLPT Rating
    let jlptRating = $(card).find('.concept_light-tag:nth-child(2)').text();
    let jlptRegex = jlptRating.match(JLPT_REGEX);
    // Stage 3: Part of Speech
    let grammar = $(card).find('.concept_light-meanings > .meanings-wrapper .meaning-tags:first').text().split(',');
    // Stage 4: English Meaning
    let meaning = $(card).find('.concept_light-meanings > .meanings-wrapper .meaning-wrapper:first .meaning-meaning').text();
    // Stage 5: Assemble Object
    return {
        kanji: kanjiStr,
        furi: furigana,
        jlpt: (jlptRegex ? jlptRegex : jlptRating),
        gram: grammar,
        def: meaning,
    };
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
    return `${card.kanji}${OUTPUT_DELIMETER}${formatFuriStr(card)}${OUTPUT_DELIMETER}${card.jlpt}${OUTPUT_DELIMETER}${card.gram}${OUTPUT_DELIMETER}${card.def}`;
}

/**
 * Generate list of terms to eventually send to Jisho.org
 * @param {*} file target file to read for terms
 * @returns list of terms
 */
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

/**
 * Generate list of card data objects from a given term list
 * @param {*} termList list of N terms passed in from parseTermList()
 * @returns list of card data objects
 */
function getCardList(termList){
    return Promise.all(termList.map(getJishoCard));
}

/**
 * Write list of card objects to a file in csv-like format
 * Each term is separated by a newline
 * @param {*} cardList list of card data objects
 */
function genFile(cardList, outputFile='output.txt'){
    let fileData = "";
    for(const card of cardList){
        fileData += `${cardToString(card)}\n`;
    }
    fs.writeFile(path=OUTPUT_DIR + outputFile,data=fileData, callback= () => console.log(`Writing Complete - File: ${OUTPUT_DIR + outputFile} - Terms Generated: ${cardList.length}.`));
}

function main(){
    let inputDir = process.argv[2];
    if(!inputDir) return console.error("MISSING INPUT DIRECTORY ARG. Please provide the path to taret input dir");
    fs.rmSync(OUTPUT_DIR, { force: true, recursive: true});
    fs.mkdir(OUTPUT_DIR, dir_err => {
        if(dir_err) return console.error(err);
        fs.readdir(inputDir, (err, files) => {
            if(err) return console.error(err);
            files.forEach(file => {
                parseTermList(`${inputDir}/${file}`).then(getCardList).then(cardList => genFile(cardList, file))
            });
        });
    });
}

main();