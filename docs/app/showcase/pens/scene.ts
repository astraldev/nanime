import type { BufferGeometry } from 'three'
import { AmbientLight, BoxGeometry, Euler, Group, LatheGeometry, Mesh, MeshPhongMaterial, PerspectiveCamera, PointLight, Quaternion, Scene, Vector2, Vector3, WebGLRenderer } from 'three'

export interface Vec3 { x: number, y: number, z: number }

export interface Writing {
  // Where the pen is held on the screen, in CSS pixels: at its nib, sliding to its middle as it comes to rest.
  x: number
  y: number
  // How much the writing pose overrides the flight pose, 0 to 1.
  weight: number
  // How far the nib is raised off the page, towards the camera, in scene units.
  lift: number
  // How far the pen has turned from writing to resting under the word, 0 to 1.
  resting: number
}

// Plain objects the page animates; the scene reads them on every render.
export interface SceneState {
  position: Vec3
  rotation: Vec3
  writing: Writing
}

export interface SceneColors { body: number, accent: number }

const PEN_LENGTH = 90
const SIDES = 10

// [radius, distance from the tip], turned around the pen's axis.
const TIP_PROFILE: [number, number][] = [[0, 0], [0.5, 0.4], [0.9, 1.6], [2.6, 9], [2.9, 10]]
const BODY_PROFILE: [number, number][] = [
  [2.9, 10], [3.1, 11], [3.1, 30], [3.7, 31], [3.7, 33], [3.4, 34],
  [3.4, 84], [3, 88], [1.6, 89.6], [0, 90],
]

const PEN_AXIS = new Vector3(0, 0, 1)
// Held like a right hand holds it: nib pointing into the screen, body leaning up and right.
const WRITING_ROTATION = new Quaternion().setFromUnitVectors(PEN_AXIS, new Vector3(-0.35, -0.45, -0.82).normalize())
// Resting under the word: the body leans right instead, so it does not cover the writing.
const RESTING_ROTATION = new Quaternion().setFromUnitVectors(PEN_AXIS, new Vector3(-0.75, -0.12, -0.65).normalize())

// Turns a profile around the Y axis, then lays it along Z with the nib at +Z.
function turn(profile: [number, number][]) {
  const geometry = new LatheGeometry(profile.map(([radius, y]) => new Vector2(radius, y)), SIDES)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, 0, PEN_LENGTH / 2)
  return geometry
}

export function createPenScene(canvas: HTMLCanvasElement, state: SceneState) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)

  const scene = new Scene()
  const camera = new PerspectiveCamera(45, 1, 1, 2000)
  camera.position.set(0, 0, 180)
  camera.lookAt(new Vector3(0, 5, 0))

  // three.js lights are physical now; π and no decay keep the flat, even shading.
  const light = new PointLight(0xFFFFFF, 0.75 * Math.PI, 0, 0)
  light.position.set(70, -20, 150)
  scene.add(light, new AmbientLight(0xFFFFFF, 1.2 * Math.PI))

  const body = new MeshPhongMaterial({ specular: 0x888888, shininess: 5, flatShading: true })
  const accent = new MeshPhongMaterial({ specular: 0xFFFFFF, shininess: 40, flatShading: true })

  const clip = new BoxGeometry(1.2, 1.4, 26)
  clip.translate(0, 4.2, -PEN_LENGTH / 2 + 17)

  const parts: [BufferGeometry, MeshPhongMaterial][] = [[turn(TIP_PROFILE), accent], [turn(BODY_PROFILE), body], [clip, accent]]
  const pen = new Group()
  for (const [geometry, material] of parts) pen.add(new Mesh(geometry, material))
  scene.add(pen)

  let width = 0
  let height = 0
  const flightRotation = new Euler()
  const grip = new Vector3()
  const nibDirection = new Vector3()
  const toCamera = new Vector3()
  const writingPosition = new Vector3()
  const writingRotation = new Quaternion()
  const nibOnScreen = new Vector3()
  const backOnScreen = new Vector3()
  const gripOnScreen = new Vector3()

  // The point under a screen pixel on the plane at depth `z`; the page is z = 0.
  function screenToWorld(x: number, y: number, z: number, target: Vector3) {
    target.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5).unproject(camera).sub(camera.position)
    return target.multiplyScalar((z - camera.position.z) / target.z).add(camera.position)
  }

  // A resting pen's back is nearer the camera and looks bigger than its nib, so its middle is not
  // where it looks centred. Shifts it until its ends straddle the grip on screen.
  function balance(amount: number) {
    nibOnScreen.copy(writingPosition).addScaledVector(nibDirection, PEN_LENGTH / 2).project(camera)
    backOnScreen.copy(writingPosition).addScaledVector(nibDirection, -PEN_LENGTH / 2).project(camera)
    gripOnScreen.copy(grip).project(camera)
    gripOnScreen.x -= ((nibOnScreen.x + backOnScreen.x) / 2 - gripOnScreen.x) * amount
    gripOnScreen.y -= ((nibOnScreen.y + backOnScreen.y) / 2 - gripOnScreen.y) * amount
    writingPosition.add(gripOnScreen.unproject(camera).sub(grip))
  }

  function render() {
    const { position, rotation, writing } = state
    pen.position.set(position.x, position.y, position.z)
    pen.quaternion.setFromEuler(flightRotation.set(rotation.x, rotation.y, rotation.z))

    if (writing.weight > 0) {
      writingRotation.slerpQuaternions(WRITING_ROTATION, RESTING_ROTATION, writing.resting)
      nibDirection.copy(PEN_AXIS).applyQuaternion(writingRotation)
      // The grip slides from the nib to the middle, at the depth it has while the nib is on the page.
      const fromNib = (PEN_LENGTH / 2) * writing.resting
      screenToWorld(writing.x, writing.y, -nibDirection.z * fromNib, grip)
      // Raised along the line of sight, so the grip stays over the same point on the screen.
      grip.addScaledVector(toCamera.subVectors(camera.position, grip).normalize(), writing.lift)
      writingPosition.copy(grip).addScaledVector(nibDirection, fromNib - PEN_LENGTH / 2)
      if (writing.resting > 0) balance(writing.resting)
      pen.position.lerp(writingPosition, writing.weight)
      pen.quaternion.slerp(writingRotation, writing.weight)
    }

    renderer.render(scene, camera)
  }

  function resize() {
    width = window.innerWidth
    height = window.innerHeight
    camera.aspect = width / height
    camera.position.z = Math.max(180, (screen.width - width) / 3)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    renderer.setSize(width, height)
    render()
  }

  function setColors(colors: SceneColors) {
    body.color.setHex(colors.body)
    accent.color.setHex(colors.accent)
    render()
  }

  function dispose() {
    for (const [geometry] of parts) geometry.dispose()
    body.dispose()
    accent.dispose()
    renderer.dispose()
    // Browsers cap live WebGL contexts; free this one now instead of at garbage collection.
    renderer.forceContextLoss()
  }

  return { render, resize, setColors, dispose }
}

export type PenScene = ReturnType<typeof createPenScene>
