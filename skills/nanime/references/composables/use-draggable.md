# `useDraggable`

Docs: https://nanimejs.netlify.app/composables/use-draggable

## Draggable list items

Give each item its own component, with `useDraggable` inside it. To drop
an item out of the list, hide its handle with `v-if` inside an
`<AnimeTransition>` and remove it from the array only in `@after-leave`.
`useDraggable` reverts its draggable when the component unmounts, and the
revert moves the element back to where the drag started. Removing the item
on release makes it jump back to its slot before it fades.
