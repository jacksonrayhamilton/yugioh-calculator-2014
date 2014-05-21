Improvements
============

Dynamic height.

At certain page dimensions, stop using dynamic width and height and use
arbitrary proportions.

Resetting
- Remove match-making. Just reset.

Random
- More secure seeded random number.

Remove match-making; just reset.

Change what is currently "history" into "logging". Just permanent strings.

History now becomes a list of deltas, which when applied in reverse will undo
life point actions.

New features
============

Timer Reset
- Confirm to reset timer.

History separated by games.
- Show current by default, offer menu option to show others.
  - After choosing this option show others the next time you visit, except if
    you start a new game, then show the current again as you would expect.

Undo button.
- Moves history pointer back, up to the start of the current game.
  - However this action is recorded in the history.

Counters.
- Generic and deck-specific counters.

Reference
- Lookup Forbidden and Limited List
- Rulings scraper

Expression Evaluator
- Click shift to enter expression mode
- Plus and minus will simply be added to your expression at the end of the
  string in which the cursor is currently positioned.
- When you click shift again evaluate the expression and make it into your new
  quantity.

Toggle between interfaces with a button.

Different themes.

Design
======

At certain width also start decreasing font size.

Prefer to only change on height change, only if getting cramped should you
change on width.

Technical Stuff
===============

Android web wrapper.
Windows Phone wrapper.

Phonegap?
http://stackoverflow.com/questions/12840977/
