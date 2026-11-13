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

A callback uses the same positions. A callback time counts toward
`duration`, but a callback is not the previous tween for later `<` shifts.


## Registration freezes the timeline on the first play

`tween()`, `point()` and `callback()` throw after the first play. Targets
resolve once, at that first play. If a ref points at a new element, call
`cancel()` and play again to resolve it. `cancel()` keeps the registered
tweens, points and callbacks.


## Fill is chosen per element and property

With `fill: 'auto'`, the first tween on a property fills both, and later
tweens fill forwards. This keeps a later tween's `from` value from winning
before the earlier tween runs. Set `fill` to `'none'`, `'forwards'` or
`'both'` to apply one mode to every animation.

The first tween on a property applies its `from` value as soon as the
timeline is built, even if that tween starts later.


## Easing

`ease` accepts AnimeJS names (`outQuad`, `outBack(3)`), functions and
springs, plus CSS easings (`ease-out`, `cubic-bezier(...)`, `steps(...)`).
AnimeJS forms go through `waapi.convertEase`. A spring also sets the tween
duration to its settling duration unless you pass `duration` yourself.


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
one, and there is no mount step. Call `cancel()` when you are done.

`useWaapiTimeline()` adds the mount queue, Vue targets and a reactive
`isRunning` ref.


## Not supported

- Multi-stop keyframes, keyframe offsets and per-keyframe easing
- `onBegin`, `onUpdate`, `onComplete` and `then()`
- `loop`, `sync`, `set`, `remove` and `stretch`
- JS object targets and SVG attributes outside CSS
- Automatic rebuilds when a target or parameter changes
