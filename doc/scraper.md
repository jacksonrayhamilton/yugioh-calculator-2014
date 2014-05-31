/ruling
-------
- Accepts a POST request that includes the name of a card and optionally the
  site to search.

Ruling Module
-------------
- Accumulates responses from all defined websites and returns a JSON response as
  defined in scraper.json.

Website
-------
- Children of website should define a method `getRulings(card)` which uses some
  lib's getPage method to get a page's html. `getRulings` then invokes
  `parseRulings()` to parse that html and return data to the client in JSON
  format like in scraper.json.
  - Parsing will be done using Cheerio.
  - This data should be cleaned of JavaScript, general dangerous stuff, etc.
  - The client then renders all the items it found.
- Search engines can later be defined as websites. They can invoke the
  `parseRulings` methods of other websites to accumulate rulings.
  - Filtration can be used in this case to avoid duplicates.

Yugioh Wikia
------------
- Defines a method for constructing wikia page urls: getPagePath(card) which is
  used by `getRulings` and is passed to `getPage`.

Client
------
- After receiving the JSON response it will create headings for each "source",
  which will be followed by the items found which will each be placed in `<li>`
  tags.
