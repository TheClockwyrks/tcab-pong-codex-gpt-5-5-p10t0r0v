# Carom

Carom is a top-down browser paddle duel built on the Simple 2D engine. Two
paddles trade a fast ball across a dark field while two rotating, swaying center
obstacles turn simple returns into bank shots.

The signature mechanic is spin: strike the ball while your paddle is moving and
its flight curves after contact. A match is first to 11 with a two-point lead,
with Solo against an AI opponent and Versus for two players sharing the keyboard.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite serves the game locally with hot reload.

## Production Build

```sh
npm run build
```

The static site is emitted into `dist/` with `dist/index.html` as the entry
point. It can be served as-is from a static file server.

## Controls

- Left paddle: `W` and `S`
- Right paddle in Versus: `ArrowUp` and `ArrowDown`
- Solo mode: either `W/S` or the arrow keys move the human paddle
- Confirm menu item: `Enter` or `Space`
- Pause or resume: `P` or `Escape`
- Back: `Escape`
- Mute: `M`

Touch controls are available through the browser engine's dual-vertical layout.
