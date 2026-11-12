# `useSplitText`

Docs: https://nanimejs.netlify.app/composables/use-split-text

`chars`, `words` and `lines` are empty during `setup()`. Pass the ref
itself to `useAnimate` (`useAnimate(chars, ...)`), never `chars.value`:
`chars.value` reads the empty array and the animation gets no targets.

## Text Vue also renders must not re-render

`useSplitText` writes into the element. If Vue also renders the changing
value there, they overwrite each other. Render the first value once with
`v-once` and pass changes through the `html` option:

```vue
<h2 ref="title" v-once>{{ track.title }}</h2>
```

Call `refresh()` after editing the split text by hand.

## Create `stagger()` inside a getter when the text changes

A plain-object `stagger()` works out its steps for the first split only, so
after the text changes some characters enter at the wrong time.

```ts
// wrong: the stagger keeps the first split's steps
useAnimate(chars, { opacity: [0, 1], delay: stagger(40) })

// right: a getter makes a new stagger for every split
useAnimate(chars, () => ({ opacity: [0, 1], delay: stagger(40) }))
```

Docs: https://nanimejs.netlify.app/composables/utilities#create-stagger-inside-a-getter-when-items-can-be-added
