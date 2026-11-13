# `useWaapiTimeline`

Docs: https://nanimejs.netlify.app/composables/use-waapi-timeline

Experimental. Import it from `#nanime/experimental` in Nuxt or
`nanime/experimental` in Vue. It is not auto-imported and ships as its own
entry.

```ts
import { useWaapiTimeline } from '#nanime/experimental'

const timeline = useWaapiTimeline()

timeline.point('open', 0)
timeline.tween(panel, { opacity: [0, 1], at: 'open', ease: 'outQuad' })
timeline.callback(() => emit('opened'), 'open')
timeline.play()
```


## The browser owns the clock

Every property in a tween becomes a WAAPI `Animation` with its own delay and
end delay, aligned to one null-target clock. No JavaScript runs per frame,
except the callback loop when the timeline has callbacks.

The composable returns a plain object. Its methods are closures, so
destructuring them works.


## Positions

`at` accepts:

- a number in milliseconds, `0` by default
- a point name, defined with `point('open', 0)`
- a shift from the previous tween's start, `<+150`, `<-20%`, `<+0.2s`
- a shift from a point, `open+150`, `open-20%`

This differs from AnimeJS. Its `<` is the previous tween's end, `<<` is its
start, and an omitted position appends. Here `<` is the start, `<<` is not
supported, and an omitted `at` is `0`.

A callback uses the same positions, but one before `0` throws. A callback
time counts toward `duration`, but a callback is not the previous tween for
later `<` shifts.

A string that is not a point or a `<` shift is read as a point name and
throws: `'120'` and `'20%'` both throw. Write a time as a number.


## Registration freezes the timeline on the first build

The first `play()`, `reverse()`, `restart()`, `alternate()` or `seek()`
builds the timeline. After it, `tween()`, `point()` and `callback()` throw.
In `setup()` these calls queue until mount, so tweens added after a queued
`play()` still count. Each registration call validates its arguments, so a
bad position or value throws at that call, not at the first play.

Targets resolve once, at the build. A `null` target is skipped with no
error, and a `v-if` element that renders again is a new element the build
never saw. Watch the template ref and call `cancel().play()` to resolve it
again. `cancel()` keeps the registered tweens, points and callbacks.


## Values go to WAAPI as-is

CSS properties such as `translate`, `rotate`, `scale` and `opacity` work.
Lengths need units (`'160px'`). AnimeJS-only names such as `x` and `y` do
nothing, with no error, and a `stagger()` value throws. A property takes
one start and one end: `[from, to]`, `{ from, to }`, or a single value that
animates from the current value. Give a later tween on the same property the
previous tween's `to` as its `from`, or the element jumps.


## Playback

`play()` from a pause continues, while running backward it turns around in
place, and after the timeline finishes it replays from `0`. `reverse()`
mirrors it. `alternate()` on a timeline that has not played yet plays
forward. `seek()` keeps a running timeline running unless it lands on an
end.

Only `isRunning` is a ref. `duration`, `currentTime`, `progress`, `paused`
and `completed` are plain getters, so read them in a `watch` on `isRunning`
or a `requestAnimationFrame` loop.


## Fill is chosen per element and property

With `fill: 'auto'`, the first tween on a property fills both, and later
tweens fill forwards. This keeps a later tween's `from` value from winning
before the earlier tween runs. Set `fill` to `'none'`, `'forwards'` or
`'both'` to apply one mode to every animation.

The first tween on a property applies its `from` value as soon as the
timeline is built, even if that tween starts later.

The timeline persists every animation. Chrome removes a finished fill
animation when a later tween covers the same property, and reverse would
jump to the element's base value between the two tweens without it.


## Easing

`ease` accepts AnimeJS names (`outQuad`, `outBack(3)`), functions and
springs, plus CSS easings (`ease-out`, `cubic-bezier(...)`, `steps(...)`).
AnimeJS forms go through `waapi.convertEase`. A spring also sets the tween
duration to its settling duration unless you pass `duration` yourself. An
unknown name logs a warning once and falls back to `'linear'`.

For a different reverse feel, pass `ease: { forward, reverse }`. No curve is
derived for you; the `reverse` curve is used while playing backward. Since
reverse walks a curve backwards, `{ forward: 'outQuad', reverse: 'inQuad' }`
starts fast in both directions.


## Callbacks

`callback(fn, at?)` and `callback({ fn, at })` run when the playhead crosses
the time. They run in reverse order when the timeline plays backward. A
pause flushes up to the pause time, and the clock's finish flushes to its
end. `seek()` does not run callbacks. Reduced motion runs every callback
once without the loop.

Callbacks use one `requestAnimationFrame` loop. In a hidden tab the loop
pauses, so they run together on the next frame or when the clock ends.


## The Vue-free factory

`createWaapiTimeline()` returns the same timeline without Vue lifecycle:
`isRunning` is a boolean, targets are DOM targets or a function returning
one, and there is no mount step. It ignores the module's `reducedMotion`
setting unless you pass `isReducedMotion`. Call `cancel()` when you are done.

`useWaapiTimeline()` adds the mount queue, Vue targets and a reactive
`isRunning` ref.


## Not supported

- Multi-stop keyframes, keyframe offsets and per-keyframe easing
- `onBegin`, `onUpdate`, `onComplete` and `then()`
- `loop`, `sync`, `set`, `remove` and `stretch`
- JS object targets and SVG attributes outside CSS
- Automatic rebuilds when a target or parameter changes
