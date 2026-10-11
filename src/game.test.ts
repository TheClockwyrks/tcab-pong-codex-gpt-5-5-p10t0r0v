import { describe, expect, it, vi } from "vitest";
import type { InitApi, UpdateApi } from "@clockwyrks/simple-2d";
import { FIELD_CX, FIELD_CY, P1_X1, BALL_R, HOLD_TIME } from "./constants";
import { game, type CaromDebugApi, type CaromState } from "./game";

const makeInitApi = (): InitApi<CaromState> => ({
  input: {
    register: vi.fn(),
    layout: () => null,
  },
  audio: {
    define: vi.fn(),
    load: vi.fn(),
  },
  assets: {
    loadImage: vi.fn(),
    loadAudio: vi.fn(),
    load: vi.fn(),
    resolve: (path) => path,
  },
  diagnostics: {
    register: vi.fn(),
  },
  events: {
    on: vi.fn(() => vi.fn()),
  },
  viewport: () => ({
    width: 1280,
    height: 720,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  }),
});

const makeUpdateApi = (): UpdateApi => {
  let muted = false;
  const values = new Map<string, number>();
  const pressed = new Set<string>();
  return {
    input: {
      value: (name) => values.get(name) ?? 0,
      pressed: (name) => {
        const has = pressed.has(name);
        pressed.delete(name);
        return has;
      },
      pointer: () => ({
        x: -1,
        y: -1,
        down: false,
        device: "mouse",
        buttons: [],
      }),
      pointerPressed: () => false,
      pointerReleased: () => false,
      pointerSamples: () => [],
      pointerContacts: () => [],
      wheel: () => ({ x: 0, y: 0 }),
    },
    audio: {
      play: vi.fn(),
      loop: vi.fn(),
      stop: vi.fn(),
      looping: () => false,
      setMuted: (next) => {
        muted = next;
      },
      muted: () => muted,
    },
    frame: () => ({ count: 0, timeMs: 0, lastDeltaMs: 0 }),
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  };
};

const initialized = (): [CaromState, CaromDebugApi] =>
  game.initialize(makeInitApi()) as [CaromState, CaromDebugApi];

describe("Carom simulation", () => {
  it("initializes the title state and debug snapshot", () => {
    const [state, debug] = initialized();
    const snapshot = debug.snapshot(state);

    expect(state.screen).toBe("title");
    expect(snapshot.version).toBe(1);
    expect(snapshot.ball?.x).toBe(FIELD_CX);
    expect(snapshot.ball?.y).toBe(FIELD_CY);
    expect(snapshot.obstacles).toHaveLength(2);
  });

  it("serves after the countdown elapses without advancing the ball that frame", () => {
    const [state, debug] = initialized();
    const api = makeUpdateApi();
    const countdown = debug.setBallServeSign(
      debug.setScreen(state, "countdown"),
      1,
    );

    const next = game.update(countdown, api, HOLD_TIME);

    expect(next.screen).toBe("playing");
    expect(next.ball?.held).toBe(false);
    expect(next.ball?.x).toBe(FIELD_CX);
    expect(next.ball?.y).toBe(FIELD_CY);
    expect(next.ball?.vx).toBeLessThan(0);
    expect(next.ball?.vy).toBeGreaterThan(0);
  });

  it("adds paddle spin and speed on a front-face hit", () => {
    const [state, debug] = initialized();
    const api = makeUpdateApi();
    let posed = debug.setScreen(state, "playing");
    posed = debug.setBallHeld(posed, false);
    posed = debug.setBallPosition(posed, P1_X1 + BALL_R + 1, FIELD_CY);
    posed = debug.setBallVelocity(posed, -520, 0);
    posed = debug.setPaddleCy(posed, "left", FIELD_CY);
    posed = debug.setPaddleDriven(posed, "left", true);
    posed = debug.setPaddleVy(posed, "left", 300);

    const next = game.update(posed, api, 1 / 120);

    expect(next.ball?.vx).toBeGreaterThan(0);
    expect(next.ball?.spin).toBeGreaterThan(0);
    expect(Math.hypot(next.ball?.vx ?? 0, next.ball?.vy ?? 0)).toBeGreaterThan(
      520,
    );
  });

  it("scores and parks a fresh held ball after a goal", () => {
    const [state, debug] = initialized();
    const api = makeUpdateApi();
    let posed = debug.setScreen(state, "playing");
    posed = debug.setBallHeld(posed, false);
    posed = debug.setBallPosition(posed, 1298, FIELD_CY);
    posed = debug.setBallVelocity(posed, 520, 0);

    const next = game.update(posed, api, 1 / 120);

    expect(next.score.p1).toBe(1);
    expect(next.receiver).toBe("right");
    expect(next.screen).toBe("countdown");
    expect(next.ball?.held).toBe(true);
    expect(next.ball?.trail).toHaveLength(0);
  });
});
