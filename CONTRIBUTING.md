# Contributing to this repository

You may add new icons to this repository, but there are some guidelines you have to follow if you want to open up a PR. It is recommended to first open up an issue, describing the icon(s) you would like to add/have added. Once the viability of the new icon and the rough design have been agreed upon, you may open up a PR.

Below are the icon design and file naming guidelines. Exceptions may be made, but generally all icons should follow these guidelines.

## Icon design guidelines

1. The icon should visually and uniquely represent the puzzle used in the event. For example, it can depict one face of the puzzle.
2. Text must be avoided inside of icons. Exception: numbers are allowed to be used in icons for puzzles with more than seven layers; the following font must be used for that (the source files are in PATH):

DIGITS IMAGE

3. Use the "bean" shape for blindfolded events. It may appear vertically on the right side with the big curve facing left, or horizontally on the bottom with the big curve facing down.
4. Use the hand shape for one-handed events.
5. Use the pencil shape for fewest moves events.
6. For team events, use circles to represent the number of participants.
7. Use the foot shape for events done with the feet.
8. Use the stopwatch shape for "speed" variants of an event (e.g. 3x3x3 Speed-Blind).
9. For events where multiple puzzles are solved, multiple puzzles may be represented in the icon. Some of the depicted puzzles may be simplified.

## File naming guidelines

Below are some guidelines on how new icon files should be named:

1. It should be clear what event the icon represents from the file name.
2. Icon names should be concise and ideally not exceed 16 characters. Words may be shortened, as long as guideline 1 isn't broken (e.g. `pyram` for Pyraminx).
3. Underscores (`_`) must be used as delimiters. **Never** use dashes (`-`), as they are used as delimiters for round IDs (e.g. `333-r1`).
4. Naming conventions:
  1. For NxN events and their derivatives, use `NNN` to represent the puzzle (e.g. `555` for 5x5x5 Cube).
  2. Use `bf` for NxN blindfolded events (e.g. `666bf` for 6x6x6 Blindfolded). For other blindfolded events, use `bld` instead (e.g. `333_team_bld` for 3x3x3 Team-Blind).
  3. Use `oh` for one-handed events.
  4. Use `fm` for fewest moves events.
  5. For team events, use Np to specify the number of participants (e.g. `miniguild_2p` for 2-man Mini Guildford).
  6. Use `ft` for events done with the feet.
  7. Use `relay` for relay events, where either multiple puzzles must be solved, or multiple competitors must each solve a puzzle one after another.
  8. Use `m` + the name of the puzzle for master versions of a puzzle (e.g. `mtetram` for Master Tetraminx).

### Changing icon codes

An icon code (the name of the icon file without the extension) may be changed. Some of the reasons for an icon code change are:

1. The community has shifted to referring to the event using some other name (e.g. "Mirror Cube" instead of "Mirror Blocks").
2. The existing code does not adequately represent the event.
3. The existing code has some sort of "clash" with another icon code (e.g. a new puzzle simply called "Minx" comes out and garners a lot of popularity, requiring the `minx` icon to be renamed).

### Event status changes

If an event in the `unofficial` directory becomes an official WCA event, it must be moved to the `event` directory.