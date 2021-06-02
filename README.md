# jisho_flashcard_script
Script used to scrape key info from Jisho.org and process it into a custom file format (csv, spaces, etc.) for later consumption by a service of your choice.

## Jisho Data Object
- **kanji** `<string>`: Text representation of a given word including both Hiragana and Kanji.
- **furi** `<list>`: List of furigana associated with a given phrase. Array index correlates to their respective kanji character in the phrase. Empty spaces account for Hiragana.
- **jlpt** `<string>`: JLPT Rating (N1 - N5) for a given term.
- **gram** `<list>`: List of grammar role for a given word. Parts of speech, transitive or intransitive, etc.
- **def** `<string>`: English translation for a given phrase.

### Example
```
{
  kanji: '英語',
  furi: [ 'えい', 'ご' ],
  jlpt: 'N5',
  gram: [ 'Noun', ' No-adjective' ],
  def: 'English (language)'
}

{
  kanji: '走り回る',
  furi: [ 'はし', '', 'まわ', '' ],
  jlpt: '',
  gram: [ 'Godan verb with ru ending', ' intransitive verb' ],
  def: 'to run around'
};
```

## Import & Export Procedure
1. Specify `INPUT_DELIMETER` at the top of the script (defaults to '\n' newline character).
2. Specify `OUTPUT_DELIMETER` at the top of the script (defaults to '\t' tab character).
3. Run command `node WebScraper.js "input_dir"`, where `input_dir` is the path to your set of term files. If not specified, the program sends an error message to the console.
4. Grab generated files from locally generated `output_dir`.
5. Upload to flashcard ingestion service of your choice!
