# blx-fsm
A simple and useful fsm

## Install

In node.

```
npm install --save blx-fsm


In browser.

``` html
<script src="/dist/blx-fsm.js"></script>
```

## Usage

```
# This is a test fsm rule file

@strict;
@define home, game, end, error;
@start home;

home (startGame) => game;
game (endGame) => end;
end (backHome) => home;
/.*/ (getError) => error;
```
