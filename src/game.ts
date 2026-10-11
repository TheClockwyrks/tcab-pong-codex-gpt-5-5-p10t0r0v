import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_HH,
  OBSTACLE_HW,
  OBSTACLE_SPIN_RATE,
  OBSTACLE_SWAY_AMP,
  OBSTACLE_SWAY_PERIOD,
  OBSTACLE_W,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_H,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
  readonly theta: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly obstacleClock: number;
  readonly obstacleClockRunning: boolean;

  readonly simTime: number;
  readonly muted: boolean;
}

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface BallSnapshot extends BallState {
  readonly speed: number;
}

export interface CaromSnapshot extends Omit<CaromState, "ball"> {
  readonly version: number;
  readonly ball: BallSnapshot | null;
}

export interface CaromDebugApi {
  readonly version: number;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  setObstacleClock(state: DeepReadonly<CaromState>, t: number): CaromState;
  setObstacleClockRunning(
    state: DeepReadonly<CaromState>,
    running: boolean,
  ): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(state: DeepReadonly<CaromState>, index: number): Rect | null;
}

export const BACKGROUND = "#071119";

const LEFT = "#21d7b6";
const RIGHT = "#ff5b7e";
const BALL = "#fff4a3";
const OBSTACLE = "#7c8cff";
const TEXT = "#e9fbff";
const DIM = "rgba(233, 251, 255, 0.5)";
const PANEL = "rgba(4, 10, 16, 0.78)";
const TWO_PI = Math.PI * 2;

interface InputEdges {
  readonly up: boolean;
  readonly down: boolean;
  readonly confirm: boolean;
  readonly back: boolean;
  readonly pause: boolean;
  readonly mute: boolean;
  readonly pointerItem: number | null;
  readonly pointerConfirm: boolean;
}

interface PhysicsEvents {
  paddle: boolean;
  wall: boolean;
  obstacle: boolean;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const chooseServeSign = (): 1 | -1 => (Math.random() < 0.5 ? -1 : 1);

const obstaclePose = (index: number, clock: number): ObstacleState => {
  const base = OBSTACLE_CENTERS[index];
  if (base === undefined) throw new Error(`Carom: no obstacle ${index}`);
  const sway =
    OBSTACLE_SWAY_AMP * Math.sin((TWO_PI * clock) / OBSTACLE_SWAY_PERIOD);
  return {
    index,
    cx: base.x,
    cy: base.y + (index === 0 ? sway : -sway),
    theta: OBSTACLE_SPIN_RATE * clock,
  };
};

const reconcileObstacles = (
  state: DeepReadonly<CaromState>,
): readonly ObstacleState[] =>
  state.obstacles.map((obstacle) =>
    obstaclePose(obstacle.index, state.obstacleClock),
  );

const makeBall = (): BallState => ({
  x: FIELD_CX,
  y: FIELD_CY,
  vx: 0,
  vy: 0,
  spin: 0,
  held: true,
  holdTimer: HOLD_TIME,
  serveSign: chooseServeSign(),
  trail: [],
});

const makePaddle = (): PaddleState => ({
  cy: FIELD_CY,
  vy: 0,
  driven: false,
  drivenVy: 0,
});

const makeTitleState = (
  muted: boolean,
  simTime = 0,
  titleIndex = 0,
): CaromState => ({
  screen: "title",
  mode: "solo",
  menuIndex: titleIndex,
  titleIndex,
  resumeScreen: "playing",
  score: { p1: 0, p2: 0 },
  winner: null,
  paddles: { left: makePaddle(), right: makePaddle() },
  ai: { tracking: true, movement: true },
  receiver: "left",
  ball: makeBall(),
  obstacles: [obstaclePose(0, 0), obstaclePose(1, 0)],
  obstacleClock: 0,
  obstacleClockRunning: true,
  simTime,
  muted,
});

const startMatch = (
  state: DeepReadonly<CaromState>,
  mode: Mode,
): CaromState => ({
  ...copyState(state),
  screen: "countdown",
  mode,
  menuIndex: 0,
  resumeScreen: "playing",
  score: { p1: 0, p2: 0 },
  winner: null,
  receiver: "left",
  ball: makeBall(),
  paddles: {
    left: { ...state.paddles.left, cy: FIELD_CY, vy: 0 },
    right: { ...state.paddles.right, cy: FIELD_CY, vy: 0 },
  },
  obstacleClock: 0,
  obstacleClockRunning: true,
  obstacles: [obstaclePose(0, 0), obstaclePose(1, 0)],
});

const copyState = (state: DeepReadonly<CaromState>): CaromState => ({
  screen: state.screen,
  mode: state.mode,
  menuIndex: state.menuIndex,
  titleIndex: state.titleIndex,
  resumeScreen: state.resumeScreen,
  score: { p1: state.score.p1, p2: state.score.p2 },
  winner: state.winner,
  paddles: {
    left: { ...state.paddles.left },
    right: { ...state.paddles.right },
  },
  ai: { ...state.ai },
  receiver: state.receiver,
  ball:
    state.ball === null
      ? null
      : { ...state.ball, trail: [...state.ball.trail] },
  obstacles: state.obstacles.map((obstacle) => ({ ...obstacle })),
  obstacleClock: state.obstacleClock,
  obstacleClockRunning: state.obstacleClockRunning,
  simTime: state.simTime,
  muted: state.muted,
});

const returnToTitle = (state: DeepReadonly<CaromState>): CaromState =>
  makeTitleState(state.muted, state.simTime, state.titleIndex);

const menuLength = (screen: Screen): number => {
  switch (screen) {
    case "title":
      return TITLE_ITEMS.length;
    case "howto":
      return 1;
    case "paused":
      return PAUSE_ITEMS.length;
    case "matchover":
      return MATCHOVER_ITEMS.length;
    case "countdown":
    case "playing":
      return 0;
  }
};

const menuItemRect = (
  state: DeepReadonly<CaromState>,
  index: number,
): Rect | null => {
  const count = menuLength(state.screen);
  if (index < 0 || index >= count) return null;
  const w = state.screen === "howto" ? 260 : 330;
  const h = 56;
  const gap = 16;
  const startY =
    state.screen === "title"
      ? 350
      : state.screen === "howto"
        ? 570
        : state.screen === "paused"
          ? 324
          : 430;
  return { x: FIELD_CX - w / 2, y: startY + index * (h + gap), w, h };
};

const pointInRect = (x: number, y: number, rect: Rect): boolean =>
  x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;

const itemAt = (
  state: DeepReadonly<CaromState>,
  x: number,
  y: number,
): number | null => {
  for (let index = 0; index < menuLength(state.screen); index += 1) {
    const rect = menuItemRect(state, index);
    if (rect !== null && pointInRect(x, y, rect)) return index;
  }
  return null;
};

const readInput = (
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): InputEdges => {
  const up = api.input.pressed("p1-up") || api.input.pressed("p2-up");
  const down = api.input.pressed("p1-down") || api.input.pressed("p2-down");
  const confirm = api.input.pressed("confirm");
  const back = api.input.pressed("back");
  const pause = api.input.pressed("pause");
  const mute = api.input.pressed("mute");
  const pointer = api.input.pointer();
  const hover = itemAt(state, pointer.x, pointer.y);
  let downItem: number | null = null;
  let upItem: number | null = null;
  let contactItem: number | null = null;
  for (const sample of api.input.pointerSamples()) {
    const hit = itemAt(state, sample.x, sample.y);
    if (sample.type === "down") downItem = hit;
    if (sample.type === "up") upItem = hit;
    if (sample.device === "touch" && hit !== null) contactItem = hit;
  }
  const pointerItem = contactItem ?? hover;
  return {
    up,
    down,
    confirm,
    back,
    pause,
    mute,
    pointerItem,
    pointerConfirm: downItem !== null && upItem !== null && downItem === upItem,
  };
};

const moveMenu = (state: CaromState, edges: InputEdges): CaromState => {
  const count = menuLength(state.screen);
  if (count === 0) return state;
  let menuIndex = state.menuIndex;
  if (edges.up) menuIndex = (menuIndex + count - 1) % count;
  else if (edges.down) menuIndex = (menuIndex + 1) % count;
  if (edges.pointerItem !== null) menuIndex = edges.pointerItem;
  return { ...state, menuIndex };
};

const confirmMenu = (state: CaromState, edges: InputEdges): CaromState => {
  if (edges.up || edges.down) return state;
  const pointerConfirmed = edges.pointerConfirm && edges.pointerItem !== null;
  const confirmed = edges.confirm || pointerConfirmed;
  if (!confirmed) return state;
  const selected = pointerConfirmed
    ? (edges.pointerItem ?? state.menuIndex)
    : state.menuIndex;

  switch (state.screen) {
    case "title": {
      const withTitle = { ...state, titleIndex: selected, menuIndex: selected };
      if (selected === 0) return startMatch(withTitle, "solo");
      if (selected === 1) return startMatch(withTitle, "versus");
      return { ...withTitle, screen: "howto", menuIndex: 0 };
    }
    case "howto":
      return returnToTitle(state);
    case "paused":
      if (selected === 0) return { ...state, screen: state.resumeScreen };
      if (selected === 1) return startMatch(state, state.mode);
      return returnToTitle(state);
    case "matchover":
      if (selected === 0) return startMatch(state, state.mode);
      return returnToTitle(state);
    case "countdown":
    case "playing":
      return state;
  }
};

const handleInput = (
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): CaromState => {
  const edges = readInput(state, api);
  let next = copyState(state);
  if (edges.mute) {
    const muted = !api.audio.muted();
    api.audio.setMuted(muted);
    next = { ...next, muted };
  } else if (next.muted !== api.audio.muted()) {
    api.audio.setMuted(next.muted);
  }

  switch (state.screen) {
    case "title":
      next = moveMenu(next, edges);
      next = confirmMenu(next, edges);
      break;
    case "howto":
      if (edges.back) next = returnToTitle(next);
      else next = confirmMenu(next, edges);
      break;
    case "countdown":
    case "playing":
      if (edges.pause) {
        next = {
          ...next,
          resumeScreen: state.screen,
          screen: "paused",
          menuIndex: 0,
        };
      }
      break;
    case "paused":
      if (edges.pause || edges.back)
        next = { ...next, screen: next.resumeScreen };
      else {
        next = moveMenu(next, edges);
        next = confirmMenu(next, edges);
      }
      break;
    case "matchover":
      if (edges.back) next = returnToTitle(next);
      else {
        next = moveMenu(next, edges);
        next = confirmMenu(next, edges);
      }
      break;
  }
  return next;
};

const integratePaddle = (
  paddle: DeepReadonly<PaddleState>,
  vy: number,
  dt: number,
): PaddleState => {
  const nextCy = clamp(paddle.cy + vy * dt, PADDLE_MIN_CY, PADDLE_MAX_CY);
  const actualVy =
    dt > 0 && nextCy !== paddle.cy ? (nextCy - paddle.cy) / dt : vy;
  return { ...paddle, cy: nextCy, vy: actualVy };
};

const humanVy = (up: number, down: number): number =>
  (down - up) * PADDLE_SPEED;

const advancePaddles = (
  state: CaromState,
  api: UpdateApi,
  dt: number,
): CaromState => {
  const p1Up = api.input.value("p1-up");
  const p1Down = api.input.value("p1-down");
  const p2Up = api.input.value("p2-up");
  const p2Down = api.input.value("p2-down");

  let leftVy =
    state.mode === "solo"
      ? humanVy(Math.max(p1Up, p2Up), Math.max(p1Down, p2Down))
      : humanVy(p1Up, p1Down);
  let rightVy = state.mode === "versus" ? humanVy(p2Up, p2Down) : 0;

  if (state.mode === "solo") {
    if (!state.ai.movement) {
      rightVy = 0;
    } else {
      let target = AI_HOME_Y;
      let deadzone = AI_HOME_DEADZONE;
      if (
        state.ai.tracking &&
        state.screen === "playing" &&
        state.ball !== null &&
        state.ball.vx > 0
      ) {
        target = state.ball.y - state.ball.vy * AI_REACT;
        deadzone = AI_DEADZONE;
      }
      const diff = target - state.paddles.right.cy;
      rightVy =
        Math.abs(diff) <= deadzone
          ? 0
          : Math.sign(diff) *
            Math.min(AI_SPEED, Math.abs(diff) / Math.max(dt, 0.000_001));
    }
  }

  if (state.paddles.left.driven) leftVy = state.paddles.left.drivenVy;
  if (state.paddles.right.driven) rightVy = state.paddles.right.drivenVy;

  return {
    ...state,
    paddles: {
      left: integratePaddle(state.paddles.left, leftVy, dt),
      right: integratePaddle(state.paddles.right, rightVy, dt),
    },
  };
};

const resolvePaddle = (
  ball: BallState,
  paddle: PaddleState,
  x0: number,
  x1: number,
  dir: 1 | -1,
  events: PhysicsEvents,
): BallState => {
  const y0 = paddle.cy - PADDLE_HALF;
  const y1 = paddle.cy + PADDLE_HALF;
  if (
    ball.x <= x0 - BALL_R ||
    ball.x >= x1 + BALL_R ||
    ball.y <= y0 - BALL_R ||
    ball.y >= y1 + BALL_R
  ) {
    return ball;
  }

  const depths = [
    { face: "left" as const, value: ball.x - (x0 - BALL_R) },
    { face: "right" as const, value: x1 + BALL_R - ball.x },
    { face: "top" as const, value: ball.y - (y0 - BALL_R) },
    { face: "bottom" as const, value: y1 + BALL_R - ball.y },
  ];
  const face = depths.reduce((best, item) =>
    item.value < best.value ? item : best,
  ).face;
  if (face === "top" || face === "bottom") {
    events.wall = true;
    return {
      ...ball,
      y: face === "top" ? y0 - BALL_R : y1 + BALL_R,
      vy:
        (face === "top" && ball.vy > 0) || (face === "bottom" && ball.vy < 0)
          ? -ball.vy
          : ball.vy,
    };
  }

  events.paddle = true;
  const offset = clamp((ball.y - paddle.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const speed = Math.min(Math.hypot(ball.vx, ball.vy) * SPEED_MULT, SPEED_CAP);
  return {
    ...ball,
    x: dir === 1 ? P1_X1 + BALL_R : P2_X0 - BALL_R,
    vx: dir * speed * Math.cos(theta),
    vy: speed * Math.sin(theta),
    spin: clamp(
      ball.spin + paddle.vy * SPIN_FROM_PADDLE,
      -SPIN_CLAMP,
      SPIN_CLAMP,
    ),
  };
};

const insideNormal = (lx: number, ly: number): { nx: number; ny: number } => {
  const px = OBSTACLE_HW - Math.abs(lx);
  const py = OBSTACLE_HH - Math.abs(ly);
  if (px <= py) return { nx: lx >= 0 ? 1 : -1, ny: 0 };
  return { nx: 0, ny: ly >= 0 ? 1 : -1 };
};

const resolveObstacle = (
  ball: BallState,
  obstacle: DeepReadonly<ObstacleState>,
  events: PhysicsEvents,
): BallState => {
  const cos = Math.cos(obstacle.theta);
  const sin = Math.sin(obstacle.theta);
  const dx = ball.x - obstacle.cx;
  const dy = ball.y - obstacle.cy;
  const lx = dx * cos + dy * sin;
  const ly = -dx * sin + dy * cos;
  const qx = clamp(lx, -OBSTACLE_HW, OBSTACLE_HW);
  const qy = clamp(ly, -OBSTACLE_HH, OBSTACLE_HH);
  const ox = lx - qx;
  const oy = ly - qy;
  const dist = Math.hypot(ox, oy);
  const inside =
    lx >= -OBSTACLE_HW &&
    lx <= OBSTACLE_HW &&
    ly >= -OBSTACLE_HH &&
    ly <= OBSTACLE_HH;
  if (!inside && dist >= BALL_R) return ball;

  const local =
    inside || dist === 0
      ? insideNormal(lx, ly)
      : { nx: ox / dist, ny: oy / dist };
  const nx = local.nx * cos - local.ny * sin;
  const ny = local.nx * sin + local.ny * cos;
  const dot = ball.vx * nx + ball.vy * ny;
  events.obstacle = events.obstacle || dot < 0;
  const push = inside
    ? BALL_R + Math.min(OBSTACLE_HW, OBSTACLE_HH)
    : BALL_R - dist;
  return {
    ...ball,
    x: ball.x + nx * Math.max(push, 0.1),
    y: ball.y + ny * Math.max(push, 0.1),
    vx: dot < 0 ? ball.vx - 2 * dot * nx : ball.vx,
    vy: dot < 0 ? ball.vy - 2 * dot * ny : ball.vy,
  };
};

const advanceBall = (
  state: CaromState,
  dt: number,
  events: PhysicsEvents,
): CaromState => {
  if (state.ball === null) return state;
  let ball = state.ball;
  if (state.screen === "countdown") {
    const holdTimer = Math.max(0, ball.holdTimer - dt);
    if (holdTimer <= 0) {
      const dir = state.receiver === "left" ? -1 : 1;
      ball = {
        ...ball,
        held: false,
        holdTimer: 0,
        trail: [],
        vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
        vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
      };
      return appendTrail({ ...state, screen: "playing", ball }, state.simTime);
    }
    return appendTrail(
      { ...state, ball: { ...ball, holdTimer } },
      state.simTime,
    );
  }

  if (state.screen !== "playing" || ball.held) return state;
  const speed = Math.hypot(ball.vx, ball.vy);
  const steps = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP));
  const h = dt / steps;
  for (let i = 0; i < steps; i += 1) {
    const currentSpeed = Math.hypot(ball.vx, ball.vy);
    if (currentSpeed > 0 && ball.spin !== 0) {
      const angle = (ball.spin / currentSpeed) * h;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ball = {
        ...ball,
        vx: ball.vx * cos - ball.vy * sin,
        vy: ball.vx * sin + ball.vy * cos,
      };
    }
    ball = {
      ...ball,
      spin: ball.spin * 0.5 ** (h / SPIN_HALFLIFE),
      x: ball.x + ball.vx * h,
      y: ball.y + ball.vy * h,
    };
    if (ball.y - BALL_R < 0 && ball.vy < 0) {
      events.wall = true;
      ball = { ...ball, y: BALL_R, vy: -ball.vy };
    } else if (ball.y + BALL_R > FIELD_H && ball.vy > 0) {
      events.wall = true;
      ball = { ...ball, y: FIELD_H - BALL_R, vy: -ball.vy };
    }
    ball = resolvePaddle(ball, state.paddles.left, P1_X0, P1_X1, 1, events);
    ball = resolvePaddle(ball, state.paddles.right, P2_X0, P2_X1, -1, events);
    for (const obstacle of state.obstacles) {
      ball = resolveObstacle(ball, obstacle, events);
    }
  }

  let next = appendTrail({ ...state, ball }, state.simTime);
  if (next.ball !== null && next.ball.x - BALL_R > FIELD_W) {
    next = scorePoint(next, "left");
  } else if (next.ball !== null && next.ball.x + BALL_R < 0) {
    next = scorePoint(next, "right");
  }
  return next;
};

const appendTrail = (state: CaromState, t: number): CaromState => {
  if (state.ball === null) return state;
  const trail = [
    ...state.ball.trail,
    { x: state.ball.x, y: state.ball.y, t },
  ].filter((sample) => t - sample.t <= TRAIL_TIME);
  return { ...state, ball: { ...state.ball, trail } };
};

const scorePoint = (state: CaromState, scorer: Side): CaromState => {
  const score = {
    p1: state.score.p1 + (scorer === "left" ? 1 : 0),
    p2: state.score.p2 + (scorer === "right" ? 1 : 0),
  };
  const leftWins = score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD;
  const rightWins = score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD;
  if (leftWins || rightWins) {
    return {
      ...state,
      score,
      winner: scorer,
      screen: "matchover",
      menuIndex: 0,
    };
  }
  return {
    ...state,
    score,
    receiver: scorer === "left" ? "right" : "left",
    ball: makeBall(),
    screen: "countdown",
  };
};

const advanceObstacles = (state: CaromState, dt: number): CaromState => {
  if (!state.obstacleClockRunning) {
    return { ...state, obstacles: reconcileObstacles(state) };
  }
  const obstacleClock = state.obstacleClock + dt;
  return {
    ...state,
    obstacleClock,
    obstacles: state.obstacles.map((obstacle) =>
      obstaclePose(obstacle.index, obstacleClock),
    ),
  };
};

const playEvents = (events: PhysicsEvents, api: UpdateApi): void => {
  if (events.paddle) api.audio.play(CUES.paddleHit);
  if (events.wall) api.audio.play(CUES.wallBounce);
  if (events.obstacle) api.audio.play(CUES.obstacleBounce);
};

const snapshot = (state: DeepReadonly<CaromState>): CaromSnapshot => ({
  ...copyState(state),
  version: CAROM_DEBUG_VERSION,
  ball:
    state.ball === null
      ? null
      : {
          ...state.ball,
          trail: [...state.ball.trail],
          speed: Math.hypot(state.ball.vx, state.ball.vy),
        },
});

const requireBall = (state: DeepReadonly<CaromState>): BallState => {
  if (state.ball === null) throw new Error("Carom: no ball is present");
  return { ...state.ball, trail: [...state.ball.trail] };
};

const setBall = (
  state: DeepReadonly<CaromState>,
  change: (ball: BallState) => BallState,
): CaromState => ({ ...copyState(state), ball: change(requireBall(state)) });

const setPaddle = (
  state: DeepReadonly<CaromState>,
  side: Side,
  change: (paddle: PaddleState) => PaddleState,
): CaromState => {
  const next = copyState(state);
  return {
    ...next,
    paddles: { ...next.paddles, [side]: change(next.paddles[side]) },
  };
};

const debug: CaromDebugApi = {
  version: CAROM_DEBUG_VERSION,
  clearWorld: (state) => ({ ...copyState(state), ball: null, obstacles: [] }),
  spawnBall: (state) => ({ ...copyState(state), ball: makeBall() }),
  spawnObstacle: (state, index) => {
    if (index !== 0 && index !== 1)
      throw new Error(`Carom: no obstacle ${index}`);
    const next = copyState(state);
    const kept = next.obstacles.filter((obstacle) => obstacle.index !== index);
    return {
      ...next,
      obstacles: [...kept, obstaclePose(index, next.obstacleClock)].sort(
        (a, b) => a.index - b.index,
      ),
    };
  },
  reset: (state) => makeTitleState(state.muted),
  reconcile: (state) => ({
    ...copyState(state),
    obstacles: reconcileObstacles(state),
  }),
  setScreen: (state, screen) => ({ ...copyState(state), screen }),
  setMode: (state, mode) => ({ ...copyState(state), mode }),
  setMenuIndex: (state, index) => ({ ...copyState(state), menuIndex: index }),
  setTitleIndex: (state, index) => ({ ...copyState(state), titleIndex: index }),
  setResumeScreen: (state, screen) => ({
    ...copyState(state),
    resumeScreen: screen,
  }),
  setScore: (state, p1, p2) => ({ ...copyState(state), score: { p1, p2 } }),
  setWinner: (state, side) => ({ ...copyState(state), winner: side }),
  setReceiver: (state, side) => ({ ...copyState(state), receiver: side }),
  setPaddleCy: (state, side, cy) =>
    setPaddle(state, side, (paddle) => ({ ...paddle, cy })),
  setPaddleVy: (state, side, vy) =>
    setPaddle(state, side, (paddle) => ({ ...paddle, drivenVy: vy })),
  setPaddleDriven: (state, side, driven) =>
    setPaddle(state, side, (paddle) => ({ ...paddle, driven })),
  setBallPosition: (state, x, y) =>
    setBall(state, (ball) => ({ ...ball, x, y })),
  setBallVelocity: (state, vx, vy) =>
    setBall(state, (ball) => ({ ...ball, vx, vy })),
  setBallSpin: (state, spin) => setBall(state, (ball) => ({ ...ball, spin })),
  setBallHeld: (state, held) => setBall(state, (ball) => ({ ...ball, held })),
  setBallHoldTimer: (state, seconds) =>
    setBall(state, (ball) => ({ ...ball, holdTimer: seconds })),
  setBallServeSign: (state, sign) =>
    setBall(state, (ball) => ({ ...ball, serveSign: sign })),
  drawBallServeSign: (state) =>
    setBall(state, (ball) => ({ ...ball, serveSign: chooseServeSign() })),
  setAiTracking: (state, enabled) => ({
    ...copyState(state),
    ai: { ...state.ai, tracking: enabled },
  }),
  setAiMovement: (state, enabled) => ({
    ...copyState(state),
    ai: { ...state.ai, movement: enabled },
  }),
  setMuted: (state, muted) => ({ ...copyState(state), muted }),
  setObstacleClock: (state, t) => {
    const next = { ...copyState(state), obstacleClock: t };
    return { ...next, obstacles: reconcileObstacles(next) };
  },
  setObstacleClockRunning: (state, running) => ({
    ...copyState(state),
    obstacleClockRunning: running,
  }),
  snapshot,
  menuItemRect,
};

const registerDiagnostics = (api: InitApi<CaromState>): void => {
  api.diagnostics.register("screen", (state) => state.screen);
  api.diagnostics.register("mode", (state) => state.mode);
  api.diagnostics.register(
    "score",
    (state) => `${state.score.p1}-${state.score.p2}`,
  );
  api.diagnostics.register("ball", (state) =>
    state.ball === null
      ? "none"
      : `${state.ball.x.toFixed(1)},${state.ball.y.toFixed(1)}`,
  );
  api.diagnostics.register("ball v", (state) =>
    state.ball === null
      ? "none"
      : `${state.ball.vx.toFixed(1)},${state.ball.vy.toFixed(1)}`,
  );
  api.diagnostics.register("ball speed", (state) =>
    state.ball === null ? 0 : Math.hypot(state.ball.vx, state.ball.vy),
  );
  api.diagnostics.register("spin", (state) => state.ball?.spin ?? 0);
  api.diagnostics.register(
    "p1",
    (state) =>
      `${state.paddles.left.cy.toFixed(1)} ${state.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "p2",
    (state) =>
      `${state.paddles.right.cy.toFixed(1)} ${state.paddles.right.vy.toFixed(1)}`,
  );
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
};

const drawField = (
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void => {
  const gradient = ctx.createLinearGradient(0, 0, FIELD_W, FIELD_H);
  gradient.addColorStop(0, "#071119");
  gradient.addColorStop(1, "#10202b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.strokeStyle = "rgba(233, 251, 255, 0.16)";
  ctx.lineWidth = 3;
  ctx.setLineDash([18, 18]);
  ctx.beginPath();
  ctx.moveTo(NET_X, 46);
  ctx.lineTo(NET_X, FIELD_H - 46);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const obstacle of state.obstacles) {
    ctx.save();
    ctx.translate(obstacle.cx, obstacle.cy);
    ctx.rotate(obstacle.theta);
    ctx.shadowBlur = 20;
    ctx.shadowColor = OBSTACLE;
    ctx.fillStyle = OBSTACLE;
    drawRoundedRect(
      ctx,
      -OBSTACLE_W / 2,
      -OBSTACLE_H / 2,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
    ctx.restore();
  }

  ctx.shadowBlur = 18;
  ctx.shadowColor = LEFT;
  ctx.fillStyle = LEFT;
  drawRoundedRect(
    ctx,
    P1_X0,
    state.paddles.left.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );
  ctx.shadowColor = RIGHT;
  ctx.fillStyle = RIGHT;
  drawRoundedRect(
    ctx,
    P2_X0,
    state.paddles.right.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );
  ctx.shadowBlur = 0;

  if (state.ball !== null) {
    if (state.ball.trail.length > 1) {
      ctx.lineWidth = BALL_R * 1.5;
      ctx.lineCap = "round";
      for (let i = 1; i < state.ball.trail.length; i += 1) {
        const a = state.ball.trail[i - 1];
        const b = state.ball.trail[i];
        const alpha = i / state.ball.trail.length;
        ctx.strokeStyle = `rgba(255, 244, 163, ${0.08 + alpha * 0.34})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.shadowBlur = 22;
    ctx.shadowColor = BALL;
    ctx.fillStyle = BALL;
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_R, 0, TWO_PI);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = TEXT;
  ctx.font = "700 48px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(state.score.p1), FIELD_CX - 110, 68);
  ctx.fillText(String(state.score.p2), FIELD_CX + 110, 68);
  ctx.font = "600 18px Inter, system-ui, sans-serif";
  ctx.fillStyle = DIM;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    96,
  );
};

const drawMenuItem = (
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
  label: string,
  index: number,
): void => {
  const rect = menuItemRect(state, index);
  if (rect === null) return;
  const selected = state.menuIndex === index;
  ctx.fillStyle = selected
    ? "rgba(233, 251, 255, 0.16)"
    : "rgba(233, 251, 255, 0.06)";
  drawRoundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
  ctx.strokeStyle = selected ? BALL : "rgba(233, 251, 255, 0.16)";
  ctx.lineWidth = selected ? 3 : 1;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = selected ? TEXT : DIM;
  ctx.font = "700 24px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  ctx.textBaseline = "alphabetic";
};

const drawOverlayPanel = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void => {
  ctx.fillStyle = PANEL;
  drawRoundedRect(ctx, x, y, w, h, 8);
};

const drawTitle = (
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void => {
  ctx.fillStyle = "rgba(7, 17, 25, 0.58)";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = "center";
  ctx.fillStyle = TEXT;
  ctx.font = "900 112px Inter, system-ui, sans-serif";
  ctx.fillText(TITLE_TEXT, FIELD_CX, 205);
  ctx.fillStyle = DIM;
  ctx.font = "500 24px Inter, system-ui, sans-serif";
  ctx.fillText(
    "curve the rally, bank the angle, claim the table",
    FIELD_CX,
    250,
  );
  TITLE_ITEMS.forEach((label, index) => drawMenuItem(ctx, state, label, index));
};

const drawHowTo = (
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void => {
  drawOverlayPanel(ctx, 260, 120, 760, 420);
  ctx.textAlign = "center";
  ctx.fillStyle = TEXT;
  ctx.font = "800 46px Inter, system-ui, sans-serif";
  ctx.fillText("HOW TO PLAY", FIELD_CX, 184);
  ctx.font = "500 24px Inter, system-ui, sans-serif";
  ctx.fillStyle = DIM;
  const lines = [
    "W/S move the left paddle. Arrow keys move the right paddle in Versus.",
    "In Solo, either side of the keyboard moves you and the right paddle tracks.",
    "Strike while moving to bend the ball after contact.",
    "Use the swaying center bars for bank shots and awkward returns.",
    "First to 11 wins, but you need a two point lead.",
  ];
  lines.forEach((line, index) =>
    ctx.fillText(line, FIELD_CX, 252 + index * 42),
  );
  drawMenuItem(ctx, state, "BACK", 0);
};

const drawPause = (
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  drawOverlayPanel(ctx, 430, 210, 420, 300);
  ctx.fillStyle = TEXT;
  ctx.font = "800 44px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", FIELD_CX, 278);
  PAUSE_ITEMS.forEach((label, index) => drawMenuItem(ctx, state, label, index));
};

const drawMatchOver = (
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  drawOverlayPanel(ctx, 390, 190, 500, 350);
  ctx.textAlign = "center";
  ctx.fillStyle = TEXT;
  ctx.font = "800 42px Inter, system-ui, sans-serif";
  ctx.fillText(
    `${state.winner === "left" ? "LEFT" : "RIGHT"} WINS`,
    FIELD_CX,
    278,
  );
  ctx.font = "700 30px Inter, system-ui, sans-serif";
  ctx.fillStyle = DIM;
  ctx.fillText(`${state.score.p1} - ${state.score.p2}`, FIELD_CX, 328);
  MATCHOVER_ITEMS.forEach((label, index) =>
    drawMenuItem(ctx, state, label, index),
  );
};

const drawCountdown = (
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void => {
  if (state.ball === null || !state.ball.held) return;
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.fillStyle = TEXT;
  ctx.font = "900 86px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    Math.ceil(state.ball.holdTimer).toString(),
    FIELD_CX,
    FIELD_CY - 46,
  );
};

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const name of ACTIONS) {
      api.input.register(name, { keys: [...BINDINGS[name]] });
    }
    api.audio.define(CUES.paddleHit, {
      wave: "triangle",
      freq: 420,
      freqTo: 760,
      durationMs: 70,
      gain: 0.18,
    });
    api.audio.define(CUES.wallBounce, {
      wave: "sine",
      freq: 260,
      freqTo: 180,
      durationMs: 55,
      gain: 0.16,
    });
    api.audio.define(CUES.obstacleBounce, {
      wave: "square",
      freq: 650,
      freqTo: 340,
      durationMs: 80,
      gain: 0.14,
    });
    api.audio.define(CUES.score, {
      wave: "sawtooth",
      freq: 180,
      freqTo: 620,
      durationMs: 180,
      gain: 0.16,
    });
    registerDiagnostics(api);
    return [makeTitleState(false), debug];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    const events: PhysicsEvents = {
      paddle: false,
      wall: false,
      obstacle: false,
    };
    const priorScore = state.score.p1 + state.score.p2;
    let next = handleInput({ ...state, simTime: state.simTime + dt }, api);
    if (next.screen === "countdown" || next.screen === "playing") {
      next = advancePaddles(next, api, dt);
      next = advanceBall(next, dt, events);
      next = advanceObstacles(next, dt);
    }
    if (next.screen !== "countdown" && next.screen !== "playing") {
      next = { ...next, obstacles: reconcileObstacles(next) };
    }
    playEvents(events, api);
    if (next.score.p1 + next.score.p2 > priorScore) {
      api.audio.play(CUES.score);
    }
    return { ...next, muted: api.audio.muted() };
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const ctx = api.ctx;
    drawField(ctx, state);
    switch (state.screen) {
      case "title":
        drawTitle(ctx, state);
        break;
      case "howto":
        drawHowTo(ctx, state);
        break;
      case "countdown":
        drawCountdown(ctx, state);
        break;
      case "paused":
        drawPause(ctx, state);
        break;
      case "matchover":
        drawMatchOver(ctx, state);
        break;
      case "playing":
        break;
    }
  },
};
