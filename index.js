const fs = require('fs');
const INPUT_DELIMETER = '\n';
const TERM_DELIMETER = ",";
const OUTPUT_DIR = './';
const { generateCardList, cardToString } = require('./webScraper');

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
            rawArray.forEach(term => {
                // Grab first item from CSV if input isn't purely terms
                const cleanTerm = term.split(TERM_DELIMETER)[0].trim();
                cleanArray.push(cleanTerm);
            });
            console.log(`SUCCESSFULLY READ FROM FILE: ${cleanArray.length} TERMS`);
            return resolve(cleanArray);
        });
    });
}

/**
 * Write list of card objects to a file with values separated by tabs 
 * Each term is separated by a newline
 * @param {*} cardList list of card data objects
 */
function genFile(cardList, outputFile='output.txt'){
    let fileData = "";
    console.log(`NOW WRITING TO FILE: ${cardList.length} FLASHCARDS.`);
    for(const card of cardList){
        fileData += `${cardToString(card)}\n`;
    }
    fs.writeFile(path=OUTPUT_DIR + outputFile, data=fileData, callback= () => console.log(`Writing Complete - File: ${OUTPUT_DIR + outputFile} - Terms Generated: ${cardList.length}.`));
}

function main(){
    let inputFile = process.argv[2];
    if(!inputFile) return console.error("MISSING INPUT FILE. Please provide the path to taret input file");
    try{
        parseTermList(inputFile).then(generateCardList).then(genFile);
    } catch (error){
        console.error(error);
    }
}

main();
