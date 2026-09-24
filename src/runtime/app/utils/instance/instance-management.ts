import { getCurrentInstance } from 'vue'

export enum AnimationComponentFlags {
  Watchable, Instant,
}

export function getAnimationComponentFlag() {
  return getCurrentInstance()
    ? AnimationComponentFlags.Watchable
    : AnimationComponentFlags.Instant
};
