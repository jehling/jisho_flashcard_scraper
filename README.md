# jisho_to_anki_script
Script used to scrape key info from Jisho.org and process it into a custom file format (csv, spaces, etc.) for later consumption by a service of your choice.

## Jisho Data Object
- **kanji** `<string>`: Text representation of a given word including both Hiragana and Kanji.
- **furi** `<list>`: List of furigana associated with a given phrase. Array index correlates to their respective kanji character in the phrase. Empty spaces account for Hiragana.
- **jlpt** `<string>`: JLPT Rating (N1 - N5) for a given term.
- **gram** `<list>`: List of grammar role for a given word. Parts of speech, transitive or intransitive, etc.
- **def** `<string>`: English translation for a given phrase.

## Example
```
{
  kanji: "英語",
  furi: ［"えい"、"ご"］,
  jlpt: "JLPT N5",
  gram: ["Noun", "No-adjective"],
  def: "English (language)",
};
```
