# jisho_flashcard_script
Script used to scrape key details from [Jisho.org](https://jisho.org/) regarding terms passed in by an input text file. The resulting data is then formatted and written to a respective output text file. Users can then easily ingest these output files into flashcard / study programs of ther choosing.

## Table of Contents
- [Jisho Card Object](#jisho-card-object)
- [Data Flow](#data-flow)
- [Import & Export Procedure](#import-&-export-procedure)

## Jisho Card Object
### Fields
- **kanji** `<string>`: Text representation of a given word including both Hiragana and Kanji.
- **furi** `<list>`: List of furigana associated with a given phrase. Array index correlates to their respective kanji character in the phrase. Empty spaces account for Hiragana.
- **jlpt** `<string>`: JLPT Rating (N1 - N5) for a given term. Empty if not provided.
- **gram** `<list>`: List of grammar role for a given word. Parts of speech, transitive or intransitive, etc.
- **def** `<string>`: English translation for a given phrase.
- **searchTerm** `<string>`: Raw string provided by input file for term search. Either Romanji or Hiragana.
- **kanaFlag** `<Boolean>`: Flag for whether or not a given term should be corrected to the kanji equivalent.

### Example
```
// Romanji Search with default kanaFlag disabled
{
  kanji: '英語',
  furi: [ 'えい', 'ご' ],
  jlpt: 'N5',
  gram: [ 'Noun', ' No-adjective' ],
  def: 'English (language)'
  searchTerm: 'eigo',
  kanaFlag: false
}

// Hiragana search with default kanaFlag disabled
{
  kanji: '走り回る',
  furi: [ 'はし', '', 'まわ', '' ],
  jlpt: '',
  gram: [ 'Godan verb with ru ending', ' intransitive verb' ],
  def: 'to run around',
  searchTerm: 'はしりまわる',
  kanaFlag: false
};

// Hiragana search with default kanaFlag enabled
{
  kanji: '彼の',
  furi: [ 'あ', '' ],
  jlpt: [ 'N1', index: 5, input: 'JLPT N1', groups: undefined ],
  gram: [ 'Pre-noun adjectival' ],
  def: 'that; those; the',
  searchTerm: 'あの',
  kanaFlag: true
};
```

## Data FLow
### **Input**
Basic text file containing terms written in Hiragana, Kanji, or Romanji. Terms are separated by newlines `\n` such that one term exists per line. 
#### Sample Input File
```
英語
ima
たべる
読む
```
### Processing
1. Parse terms from the provided input file.
2. Make web request to [Jisho.org](https://jisho.org/) to search term definitions.
3. Scrape HTML using **JQuery** to grab term data.
4. Auto-correct input term to Kanji with Furigana unless unless an "only kana" flag is present. This flag implies that a given term is generally written using purely Hiragana or Katakana.
5. Write formatted data block to dedicated output textfile. 
### Output
Formatted text file where each line contains all of the data collected for a given term. Fields are tab `\t` separated due to the prevelance of semi-colons and commas inside Jisho definitions.
#### Sample Output File
```
英語    英[えい]語[ご]  N5      Noun, No-adjective      English (language)
今      今[いま]        N5      Noun, No-adjective, Adverb      now; the present time; just now; soon; immediately
食べる  食[た]べる      N5      Ichidan verb, Transitive verb   to eat
読む    読[よ]む        N5      Godan verb with mu ending, Transitive verb      to read
```
## Import & Export Procedure
1. Specify `INPUT_DELIMETER` at the top of the script (defaults to '\n' newline character).
2. Specify `OUTPUT_DELIMETER` at the top of the script (defaults to '\t' tab character).
3. Run command `node WebScraper.js "input_dir"`, where `input_dir` is the path to your set of term files. If not specified, the program sends an error message to the console.
4. Grab generated files from locally generated `output_dir`.
5. Upload to flashcard ingestion service of your choice!
