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
### Input
### Processing
### Output

## Import & Export Procedure
1. Specify `INPUT_DELIMETER` at the top of the script (defaults to '\n' newline character).
2. Specify `OUTPUT_DELIMETER` at the top of the script (defaults to '\t' tab character).
3. Run command `node WebScraper.js "input_dir"`, where `input_dir` is the path to your set of term files. If not specified, the program sends an error message to the console.
4. Grab generated files from locally generated `output_dir`.
5. Upload to flashcard ingestion service of your choice!
