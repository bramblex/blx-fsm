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


define aaa, bbb, cccc, ddd, eee, fff
start home

login (saasfd) => home {
  define aaa, bbb, ccc, ddd, eee, fff
  start character
  * (goCharacter) => character
  * (goGame) => game
  * (goStore) => store
}

home (logout) => login {
  define aaa, bbb, ccc, ddd, eee, fff
}

