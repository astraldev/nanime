# `useDraggable`

Docs: https://nanimejs.netlify.app/composables/use-draggable

## Draggable list items

Give each item its own component, with `useDraggable` inside it. To drop
an item out of the list, hide its handle with `v-if` inside an
`<AnimeTransition>` and remove it from the array only in `@after-leave`.
`useDraggable` reverts its draggable when the component unmounts, and the
revert moves the element back to where the drag started. Removing the item
on release makes it jump back to its slot before it fades.

## Layout changes during a drag

A draggable moves its element with `translate`, as an offset from the
element's layout box. The offset is the pointer's travel since the grab, so
anything that moves the box while the element is held (a DOM move, an
animating parent, a resize) carries the element away from the pointer.

Keep the held element's box where it is until release. Change what is
around it while it is held, and apply its own change on release, where the
box's move and the draggable's release animation can run together.

Correcting the offset during the drag is harder. `setX()` is overwritten by
the next update, and an axis `modifier` that subtracts the box's movement
needs a second correction on release.
