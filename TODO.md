# Todo

- [ ] SVG utils
- [ ] `useAnimeTimer` composable. `createTimer` is only available from `#nanime/utils` and has to be reverted by hand on unmount.
- [ ] Decide whether `useAnimatable` setters are buffered until mount, as `useAnimeLayout` does with `createBufferedProxy`, so callers can drop `?.`. Setter calls with no argument are getters and can't be queued.
