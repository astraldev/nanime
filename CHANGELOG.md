# Changelog

## v0.4.2

[compare changes](https://github.com/astraldev/nanime/compare/v0.4.1...v0.4.2)

### 🩹 Fixes

- **waapi-timeline:** Keep tween values when the direction changes mid-run ([9cdb415](https://github.com/astraldev/nanime/commit/9cdb415))

### 💅 Refactors

- **waapi-timeline:** ⚠️  Accept only CSS easing strings ([104a11c](https://github.com/astraldev/nanime/commit/104a11c))

### 📖 Documentation

- **waapi-timeline:** Document CSS-only easing and the 0.4.2 changes ([d435078](https://github.com/astraldev/nanime/commit/d435078))
- **skill:** Update the layout and verifying references ([aac002b](https://github.com/astraldev/nanime/commit/aac002b))
- Add TODO ([2f11e34](https://github.com/astraldev/nanime/commit/2f11e34))
- **waapi-timeline:** Describe direction changes and CSS-only easing ([446f3cc](https://github.com/astraldev/nanime/commit/446f3cc))

#### ⚠️ Breaking Changes

- **waapi-timeline:** ⚠️  Accept only CSS easing strings ([104a11c](https://github.com/astraldev/nanime/commit/104a11c))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.4.1

[compare changes](https://github.com/astraldev/nanime/compare/v0.4.0...v0.4.1)

### 🩹 Fixes

- **useWaapiTimeline:** Start tweens after the previous one, accept keyframes, log errors in production ([4b82947](https://github.com/astraldev/nanime/commit/4b82947))

### 📖 Documentation

- **useWaapiTimeline:** Rewrite the page, add a callback demo and a timer, start the 0.4.1 changelog ([220b9ed](https://github.com/astraldev/nanime/commit/220b9ed))
- Use npx nuxt module add in the install command ([5d50f88](https://github.com/astraldev/nanime/commit/5d50f88))
- **skill:** Cover autoplay defaults, step replay and porting v3 keyframes ([be0b652](https://github.com/astraldev/nanime/commit/be0b652))
- **agents:** Update the playground page skill ([b9de4f3](https://github.com/astraldev/nanime/commit/b9de4f3))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.4.0

[compare changes](https://github.com/astraldev/nanime/compare/v0.3.5...v0.4.0)

### 🚀 Enhancements

- **experimental:** Patch AnimeJS layout with trackTargetsOnly ([bc51be5](https://github.com/astraldev/nanime/commit/bc51be5))
- **AnimeLayoutGroup:** Add experimental trackTargetsOnly ([321d630](https://github.com/astraldev/nanime/commit/321d630))
- **transitions:** Add the animation prop and make provider defaults replace per component ([8fb4829](https://github.com/astraldev/nanime/commit/8fb4829))
- **vue:** Add the nanime/vue entry for plain Vue apps ([df158e7](https://github.com/astraldev/nanime/commit/df158e7))
- **presets:** Add typed preset definitions and build them as nanime/presets/* ([a0edf19](https://github.com/astraldev/nanime/commit/a0edf19))
- **composables:** Add default parameters for useAnimate and useDraggable ([12f1c41](https://github.com/astraldev/nanime/commit/12f1c41))
- **config:** Provide config on the app and add a preset layer ([62a8262](https://github.com/astraldev/nanime/commit/62a8262))
- **presets:** Fill in the formal, elegant and playful presets ([8e8e570](https://github.com/astraldev/nanime/commit/8e8e570))
- **presets:** Speed up elegant ([b4557a7](https://github.com/astraldev/nanime/commit/b4557a7))
- **presets:** Soften playful's bounce ([a429a9c](https://github.com/astraldev/nanime/commit/a429a9c))
- **presets:** Tighten formal, lengthen elegant ([540d251](https://github.com/astraldev/nanime/commit/540d251))
- **transitions:** Run AnimeTransition and AnimeTransitionGroup on waapi.animate() ([f9b7a06](https://github.com/astraldev/nanime/commit/f9b7a06))
- **presets:** Define move on every preset style ([b80acb6](https://github.com/astraldev/nanime/commit/b80acb6))
- **composables:** ⚠️  Replace keepTime with rebuild and add keepValue ([8897743](https://github.com/astraldev/nanime/commit/8897743))
- **composables:** Blend a keepValue rebuild into the running animation ([95277e9](https://github.com/astraldev/nanime/commit/95277e9))
- **presets:** Tune the built-in preset values and export AnimationPreset ([ec45957](https://github.com/astraldev/nanime/commit/ec45957))
- **utils:** Export defineAnimationPreset from #nanime/utils ([5c8b270](https://github.com/astraldev/nanime/commit/5c8b270))
- **module:** Warn on VueUse auto-import clashes and add vueuseAliases ([3dd8b47](https://github.com/astraldev/nanime/commit/3dd8b47))
- **module:** Generalise vueuseAliases to aliases for any auto-import clash ([88c9338](https://github.com/astraldev/nanime/commit/88c9338))
- **experimental:** Add useWaapiTimeline ([6e24716](https://github.com/astraldev/nanime/commit/6e24716))
- **experimental:** Add separate reverse easing ([41b19fb](https://github.com/astraldev/nanime/commit/41b19fb))

### 🩹 Fixes

- Build the plugin types and load the module in the suites project ([36d58f1](https://github.com/astraldev/nanime/commit/36d58f1))
- **config:** Keep the plugin from pulling runtime code into every build ([76b86c9](https://github.com/astraldev/nanime/commit/76b86c9))
- **defaults:** Guard inject in useComponentDefaults ([cebf6bc](https://github.com/astraldev/nanime/commit/cebf6bc))
- Apply the preset fade to a bare AnimeTransition and release the scroll observer on a keepValue rebuild ([5e62366](https://github.com/astraldev/nanime/commit/5e62366))
- **composables:** Animate items added to a v-for template ref list ([044343a](https://github.com/astraldev/nanime/commit/044343a))
- **composables:** Keep draggable position, refresh timeline sync and keep defaults for undefined keys ([0ccc590](https://github.com/astraldev/nanime/commit/0ccc590))
- **experimental:** Persist WAAPI animations for reverse ([3be3ce9](https://github.com/astraldev/nanime/commit/3be3ce9))
- **composables:** Guard a null scroll autoplay when useAnimate rebuilds ([04857f3](https://github.com/astraldev/nanime/commit/04857f3))

### 💅 Refactors

- **experimental:** Generate the patched copy under src/runtime ([d4dc07b](https://github.com/astraldev/nanime/commit/d4dc07b))
- **experimental:** Drop trackTargetsOnly in favour of a patch skill ([88e8c0b](https://github.com/astraldev/nanime/commit/88e8c0b))

### 📖 Documentation

- Document presets, the Vue setup and the v4 config layer ([1b638c6](https://github.com/astraldev/nanime/commit/1b638c6))
- Split pages into smaller sections and add a Guides section ([ecea312](https://github.com/astraldev/nanime/commit/ecea312))
- Quieter prose, table, callout and nav styling ([9d8337c](https://github.com/astraldev/nanime/commit/9d8337c))
- Redesign the theme, sidebar and homepage ([d8e27eb](https://github.com/astraldev/nanime/commit/d8e27eb))
- Link Guide, API and Updates from the header ([390fc03](https://github.com/astraldev/nanime/commit/390fc03))
- Reorder sidebar groups and open them by default ([076d629](https://github.com/astraldev/nanime/commit/076d629))
- Align the changelog link with the sidebar groups ([32f2e75](https://github.com/astraldev/nanime/commit/32f2e75))
- Show the changelog as a dated timeline ([dfea88e](https://github.com/astraldev/nanime/commit/dfea88e))
- Group the changelog by minor version ([28860de](https://github.com/astraldev/nanime/commit/28860de))
- List changelog versions by date on a plain rail ([72e2d16](https://github.com/astraldev/nanime/commit/72e2d16))
- Divide changelog versions by minor release ([b5a53d9](https://github.com/astraldev/nanime/commit/b5a53d9))
- Drop the changelog rail ([8623123](https://github.com/astraldev/nanime/commit/8623123))
- Group the changelog's page outline like the sidebar ([a30a540](https://github.com/astraldev/nanime/commit/a30a540))
- Mark the newest released version as latest ([4a5480e](https://github.com/astraldev/nanime/commit/4a5480e))
- Set the latest version in changelog frontmatter and badge it in the outline ([5078d29](https://github.com/astraldev/nanime/commit/5078d29))
- **home:** Show the first animation's code beside a live preview ([66ce807](https://github.com/astraldev/nanime/commit/66ce807))
- **home:** Trim the first animation to two lines ([7992197](https://github.com/astraldev/nanime/commit/7992197))
- **home:** Restyle the cards, align with the header and wait for Geom ([92ddb28](https://github.com/astraldev/nanime/commit/92ddb28))
- Rework the home demos, add a how-composables-run guide, bring nuxt-studio back in dev ([e5239fb](https://github.com/astraldev/nanime/commit/e5239fb))
- **guides:** Split configuration into configuration and defaults ([6f140d0](https://github.com/astraldev/nanime/commit/6f140d0))
- Trim getting started and home, reword the guides ([2023d6d](https://github.com/astraldev/nanime/commit/2023d6d))
- **skill:** Add the rewording, cutting and restructuring rules to the prose style ([e73cd29](https://github.com/astraldev/nanime/commit/e73cd29))
- **composables:** Move how composables run into the composables section ([2df8f05](https://github.com/astraldev/nanime/commit/2df8f05))
- **skill:** Point the composable page spec and scaffold skill at the moved guide ([34faa56](https://github.com/astraldev/nanime/commit/34faa56))
- **composables:** Restructure the composable pages around task demos ([87f1cb1](https://github.com/astraldev/nanime/commit/87f1cb1))
- **components:** Restructure the transition pages around keyframe demos ([7106129](https://github.com/astraldev/nanime/commit/7106129))
- Convert component API tables to field groups, add layout demos, drop examples intro ([899b20a](https://github.com/astraldev/nanime/commit/899b20a))
- **comparisons:** Refresh dates and add the reduced-motion row ([5a6417d](https://github.com/astraldev/nanime/commit/5a6417d))
- Document the rebuild option ([cfbfe2e](https://github.com/astraldev/nanime/commit/cfbfe2e))
- **skill:** Align the page specs and the scaffold with the new page structure ([921c336](https://github.com/astraldev/nanime/commit/921c336))
- **comparisons:** Mark playhead on rebuild as useScope only for vue-animejs ([325811a](https://github.com/astraldev/nanime/commit/325811a))
- Demos for rebuild and the built-in presets, and a tidier presets guide ([c0b7ab4](https://github.com/astraldev/nanime/commit/c0b7ab4))
- Drop the examples section and unused demos ([91603db](https://github.com/astraldev/nanime/commit/91603db))
- Update the 0.4.0 changelog, add a migration guide and tidy composable pages ([bc2985c](https://github.com/astraldev/nanime/commit/bc2985c))
- Rename the how composables run page to composable lifecycle, fix migration guide icons and match prose line height ([1bafc8c](https://github.com/astraldev/nanime/commit/1bafc8c))
- Drop the migration guide, show the left sidebar on every docs page and tidy the See also links ([3005403](https://github.com/astraldev/nanime/commit/3005403))
- Rewrite the comparison pages with fair tables and like-for-like examples ([00d356e](https://github.com/astraldev/nanime/commit/00d356e))
- Tighten the configuration page and the aliases changelog entry ([5aeb10d](https://github.com/astraldev/nanime/commit/5aeb10d))
- Cover 0.4 transition props and presets in docs and skill ([f85ddff](https://github.com/astraldev/nanime/commit/f85ddff))
- Note that onComplete runs only when an animation plays to its end ([555f128](https://github.com/astraldev/nanime/commit/555f128))
- **skill:** Document experimental useWaapiTimeline ([5d5cd5b](https://github.com/astraldev/nanime/commit/5d5cd5b))
- **experimental:** Restructure useWaapiTimeline page and demos ([7547569](https://github.com/astraldev/nanime/commit/7547569))
- Keep wide content from stretching the side columns ([5d29b01](https://github.com/astraldev/nanime/commit/5d29b01))
- **changelog:** Add experimental useWaapiTimeline to 0.4.0 ([f7b90d7](https://github.com/astraldev/nanime/commit/f7b90d7))
- Complete the 0.4.0 changelog and nanime skill ([d5360dd](https://github.com/astraldev/nanime/commit/d5360dd))
- Fix 0.4.0 claims found in the docs audit ([00ce19e](https://github.com/astraldev/nanime/commit/00ce19e))
- One-sentence 0.4.0 changelog, ten composables, Instant play on useWaapiTimeline ([2668aea](https://github.com/astraldev/nanime/commit/2668aea))
- Close the gaps from the 0.4.0 docs audit ([dfbed7a](https://github.com/astraldev/nanime/commit/dfbed7a))

### 🏡 Chore

- **docs:** Remove nuxt-studio ([167c0bc](https://github.com/astraldev/nanime/commit/167c0bc))
- **skills:** Split the nanime skill into per-topic references and update docs skills ([e646d68](https://github.com/astraldev/nanime/commit/e646d68))
- Ignore local videos and pnpm store, keep videos out of the typecheck ([83a3c47](https://github.com/astraldev/nanime/commit/83a3c47))
- Improve docs and homepage effects ([b67c2f5](https://github.com/astraldev/nanime/commit/b67c2f5))

#### ⚠️ Breaking Changes

- **composables:** ⚠️  Replace keepTime with rebuild and add keepValue ([8897743](https://github.com/astraldev/nanime/commit/8897743))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.3.5

[compare changes](https://github.com/astraldev/nanime/compare/v0.3.4...v0.3.5)

### 🩹 Fixes

- **AnimeTransition:** Defer leave done() when the animation ends synchronously ([75d11b2](https://github.com/astraldev/nanime/commit/75d11b2))

### 📖 Documentation

- Add the 0.3.5 changelog ([753aca3](https://github.com/astraldev/nanime/commit/753aca3))

### ❤️ Contributors

- Ekure Edem

## v0.3.4

[compare changes](https://github.com/astraldev/nanime/compare/0ce2a96...v0.3.4)

### 🩹 Fixes

- **useAnimeLayout:** Keep layout items settled and patch() resolving across overlapping patches ([3134e9b](https://github.com/astraldev/nanime/commit/3134e9b))

### 📖 Documentation

- Say when patch() resolves and add the 0.3.4 changelog ([42daa40](https://github.com/astraldev/nanime/commit/42daa40))

### ❤️ Contributors

- Ekure Edem

## v0.3.3

[compare changes](https://github.com/astraldev/nanime/compare/v0.3.2...v0.3.3)

### 🚀 Enhancements

- Add completeOnTabHidden prop to the transition and layout components ([932137c](https://github.com/astraldev/nanime/commit/932137c))

### 🩹 Fixes

- **useAnimeLayout:** Join patch calls made before the DOM update ([f68c8d3](https://github.com/astraldev/nanime/commit/f68c8d3))

### 📖 Documentation

- Document completeOnTabHidden and the 0.3.3 changes ([e58e52f](https://github.com/astraldev/nanime/commit/e58e52f))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.3.2

[compare changes](https://github.com/astraldev/nanime/compare/v0.3.1...v0.3.2)

### 🚀 Enhancements

- **AnimeTransitionGroup:** Add deps and shallow props ([f01b4f2](https://github.com/astraldev/nanime/commit/f01b4f2))
- Add reducedMotion option ([0ba8eba](https://github.com/astraldev/nanime/commit/0ba8eba))

### 🔥 Performance

- Tree-shake unused composables and transition CSS ([d534faf](https://github.com/astraldev/nanime/commit/d534faf))

### 🩹 Fixes

- **docs:** Redirect OG image URLs missing from the build to a fallback image ([eef0be0](https://github.com/astraldev/nanime/commit/eef0be0))
- **useSplitText:** Skip re-splitting when parameters are equal ([abc2dd1](https://github.com/astraldev/nanime/commit/abc2dd1))

### 📖 Documentation

- **performance:** Add what each API adds to the bundle ([fd24836](https://github.com/astraldev/nanime/commit/fd24836))
- Tighten shallow and deps wording, spell AnimeJS in the skill ([13cdb7f](https://github.com/astraldev/nanime/commit/13cdb7f))
- Changelog for 0.3.2 ([48e6511](https://github.com/astraldev/nanime/commit/48e6511))
- Correct the 0.3.2 performance entry ([3214664](https://github.com/astraldev/nanime/commit/3214664))
- Fold the 0.3.2 docs entries into one ([f25948d](https://github.com/astraldev/nanime/commit/f25948d))
- Name the pages and components in the 0.3.2 docs entry ([b113c74](https://github.com/astraldev/nanime/commit/b113c74))
- State the outcome in the 0.3.2 packaging entry ([b3cf96d](https://github.com/astraldev/nanime/commit/b3cf96d))
- Move the comparison pages into their own section ([10320eb](https://github.com/astraldev/nanime/commit/10320eb))

### 🤖 CI

- Publish on the release published event only ([f020276](https://github.com/astraldev/nanime/commit/f020276))

### ❤️ Contributors

- Ekure Edem

## v0.3.1

[compare changes](https://github.com/astraldev/nanime/compare/v0.3.0...v0.3.1)

### 🩹 Fixes

- **components:** Keep the layout group rule out of Tailwind v3's base layer ([86d08c2](https://github.com/astraldev/nanime/commit/86d08c2))
- **AnimeLayoutGroup:** Stop warning about valid selector lists in elements ([6e43d48](https://github.com/astraldev/nanime/commit/6e43d48))

### 📖 Documentation

- **AnimeLayoutGroup:** Suggest one shared attribute for elements ([bbbf862](https://github.com/astraldev/nanime/commit/bbbf862))
- Changelog for 0.3.1 ([b9736f5](https://github.com/astraldev/nanime/commit/b9736f5))

### 🏡 Chore

- Stop tracking the announcements folder ([81ee0b6](https://github.com/astraldev/nanime/commit/81ee0b6))

### ❤️ Contributors

- Ekure Edem

## v0.3.0

[compare changes](https://github.com/astraldev/nanime/compare/v0.2.1...v0.3.0)

### 🚀 Enhancements

- Add AnimeLayoutGroup and configurable component defaults ([594acc1](https://github.com/astraldev/nanime/commit/594acc1))
- **components:** New group defaults and layout animation fixes ([f026c71](https://github.com/astraldev/nanime/commit/f026c71))
- **useAnimeScroll:** ⚠️  Take a parameters object with ref targets and live thresholds ([be530d7](https://github.com/astraldev/nanime/commit/be530d7))
- **useScrambleText:** ⚠️  Reject duration, delay and ease in animation options ([720020e](https://github.com/astraldev/nanime/commit/720020e))

### 🩹 Fixes

- Reactive rebuilds, mount timing, and transition cleanup across core ([616b566](https://github.com/astraldev/nanime/commit/616b566))
- **docs:** Declare the packages docs imports directly ([52f5556](https://github.com/astraldev/nanime/commit/52f5556))
- **useAnimeLayout:** ⚠️  Resolve patch() with void when the animation finishes ([11bb96e](https://github.com/astraldev/nanime/commit/11bb96e))
- **useWaapiAnimate:** Rebuild only when target or parameter values change ([833a922](https://github.com/astraldev/nanime/commit/833a922))

### 📖 Documentation

- Cut the JS every docs page downloads ([4bd53ac](https://github.com/astraldev/nanime/commit/4bd53ac))
- Build demo code tabs with the Vue parser and prettier ([e697146](https://github.com/astraldev/nanime/commit/e697146))
- Document AnimeLayoutGroup and component defaults ([9187144](https://github.com/astraldev/nanime/commit/9187144))
- One demo per page, shorter prose, Phosphor icons ([e545a37](https://github.com/astraldev/nanime/commit/e545a37))
- Move Showcase and Changelog into the header ([16469a3](https://github.com/astraldev/nanime/commit/16469a3))
- Remove nuxt-studio ([8efca68](https://github.com/astraldev/nanime/commit/8efca68))
- Add the Pens showcase page ([8ba62aa](https://github.com/astraldev/nanime/commit/8ba62aa))
- Rewrite the examples as interactive app scenes ([235ee0a](https://github.com/astraldev/nanime/commit/235ee0a))
- **skills:** Restructure the nanime skill and add list and transition notes ([309efc7](https://github.com/astraldev/nanime/commit/309efc7))
- Add unreleased changelog entries ([4040699](https://github.com/astraldev/nanime/commit/4040699))
- Add a playground index page listing every playground route ([8d62324](https://github.com/astraldev/nanime/commit/8d62324))
- Tighten getting started and composables intro prose ([9649b21](https://github.com/astraldev/nanime/commit/9649b21))
- **playground:** Add defaults playgrounds for the transition and layout components ([b4535ef](https://github.com/astraldev/nanime/commit/b4535ef))
- **skills:** Cover the new group and layout defaults and playground verification ([c2b072b](https://github.com/astraldev/nanime/commit/c2b072b))
- **playground:** Remove the defaults comparison pages ([94899f1](https://github.com/astraldev/nanime/commit/94899f1))
- Make the homepage spring grid demo interactive ([0e9a66d](https://github.com/astraldev/nanime/commit/0e9a66d))
- **playground:** Remove the remaining playground pages ([4fe0837](https://github.com/astraldev/nanime/commit/4fe0837))
- Audit the changelog and document the new component defaults ([836f8c0](https://github.com/astraldev/nanime/commit/836f8c0))
- Left TOC on single pages, Examples header, hero hover, new descriptions ([64cfef0](https://github.com/astraldev/nanime/commit/64cfef0))
- Document only the nanime layer on composable pages ([b24d899](https://github.com/astraldev/nanime/commit/b24d899))
- Rewrite the public JSDoc of composables, types and module options ([72af706](https://github.com/astraldev/nanime/commit/72af706))
- Ease picker demo for useWaapiAnimate, WAAPI bounce for useSplitText ([550fd5d](https://github.com/astraldev/nanime/commit/550fd5d))

### 📦 Build

- **deps:** Move to pnpm 12, jsdom, and clean peer deps ([bd608d7](https://github.com/astraldev/nanime/commit/bd608d7))

### 🏡 Chore

- Note where use-case and regression tests live ([8e9f591](https://github.com/astraldev/nanime/commit/8e9f591))

#### ⚠️ Breaking Changes

- **useAnimeScroll:** ⚠️  Take a parameters object with ref targets and live thresholds ([be530d7](https://github.com/astraldev/nanime/commit/be530d7))
- **useScrambleText:** ⚠️  Reject duration, delay and ease in animation options ([720020e](https://github.com/astraldev/nanime/commit/720020e))
- **useAnimeLayout:** ⚠️  Resolve patch() with void when the animation finishes ([11bb96e](https://github.com/astraldev/nanime/commit/11bb96e))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.2.1

[compare changes](https://github.com/astraldev/nanime/compare/v0.2.0...v0.2.1)

### 🩹 Fixes

- Pre-bundle animejs through nanime so pnpm apps resolve it ([9a91bd6](https://github.com/astraldev/nanime/commit/9a91bd6))
- Keep inline styles AnimeTransitionGroup doesn't animate ([eeb1f7a](https://github.com/astraldev/nanime/commit/eeb1f7a))

### 📖 Documentation

- Keep full descriptions in OG images ([32f7973](https://github.com/astraldev/nanime/commit/32f7973))
- Show container and size changes in the useAnimeLayout demos ([ca23290](https://github.com/astraldev/nanime/commit/ca23290))
- Drive the animatable and scramble demos from onComplete ([3e47ccc](https://github.com/astraldev/nanime/commit/3e47ccc))
- Write the 0.2.1 changelog ([3541b38](https://github.com/astraldev/nanime/commit/3541b38))

### 🏡 Chore

- Add the nanime promo videos in 16:9 and 4:5 ([bc8c4d0](https://github.com/astraldev/nanime/commit/bc8c4d0))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.2.0

[compare changes](https://github.com/astraldev/nanime/compare/v0.1.14...v0.2.0)

### 🚀 Enhancements

- Add AnimeTransition and AnimeTransitionGroup components ([700b202](https://github.com/astraldev/nanime/commit/700b202))

### 🔥 Performance

- Fix issue with infinite recursion ([913cb0b](https://github.com/astraldev/nanime/commit/913cb0b))

### 🩹 Fixes

- Code highlight rendering ([01d9a25](https://github.com/astraldev/nanime/commit/01d9a25))
- **transition-group:** Keep centred content in place during moves ([a27fa7e](https://github.com/astraldev/nanime/commit/a27fa7e))
- **transitions:** Make stagger() work for items that enter or leave together ([c554bd1](https://github.com/astraldev/nanime/commit/c554bd1))
- Compare parameter elements by identity and make #nanime/composables importable ([6f6a15d](https://github.com/astraldev/nanime/commit/6f6a15d))

### 💅 Refactors

- **composables:** Rename useLayout.ts to useAnimeLayout.ts and add JSDoc ([3a43e30](https://github.com/astraldev/nanime/commit/3a43e30))

### 📖 Documentation

- Add per-page SEO titles and descriptions ([b4b0caf](https://github.com/astraldev/nanime/commit/b4b0caf))
- Add comparison pages for Nuxt modules and Vue packages ([c01de9f](https://github.com/astraldev/nanime/commit/c01de9f))
- Reformat MDC blocks in useDraggable and loading-sequence ([ccb69e9](https://github.com/astraldev/nanime/commit/ccb69e9))
- **installation:** Add SEO meta and a section on using the docs with AI agents ([69c2709](https://github.com/astraldev/nanime/commit/69c2709))
- Document the transition components and useAnimeLayout ([e2ba619](https://github.com/astraldev/nanime/commit/e2ba619))
- Fold the misc pages into one Utilities page ([29ef322](https://github.com/astraldev/nanime/commit/29ef322))
- **examples:** Remove the timeline storyboard and text magnet examples ([04cbb0b](https://github.com/astraldev/nanime/commit/04cbb0b))
- Keep pipes out of table cells so Nuxt Studio doesn't split them ([c33b92f](https://github.com/astraldev/nanime/commit/c33b92f))
- Rework the comparison pages ([955eba3](https://github.com/astraldev/nanime/commit/955eba3))
- **skills:** Add demo and component page specs, fix stale paths ([c323037](https://github.com/astraldev/nanime/commit/c323037))
- **skill:** Cover transitions, styles and useAnimeLayout in the nanime skill ([c2956a6](https://github.com/astraldev/nanime/commit/c2956a6))
- Show agent support on the introduction and homepage ([05c2ddd](https://github.com/astraldev/nanime/commit/05c2ddd))
- Mark pages and cards added since v0.1.14 as new ([ee4c53c](https://github.com/astraldev/nanime/commit/ee4c53c))
- **examples:** Add the media library example ([a1779f4](https://github.com/astraldev/nanime/commit/a1779f4))
- Rework the homepage around one feature grid and a live demo ([85556b0](https://github.com/astraldev/nanime/commit/85556b0))
- **examples:** Rebuild the loading sequence with transition components and springs ([8b8edac](https://github.com/astraldev/nanime/commit/8b8edac))
- **examples:** Rebuild drag to bin as a horizontal list with a fixed bin ([beaa7b4](https://github.com/astraldev/nanime/commit/beaa7b4))
- Tighten SEO copy, update example pages and agent notes ([23c527b](https://github.com/astraldev/nanime/commit/23c527b))
- Add the logo to the header, favicons and app icons, and darken accent colours in light mode ([696c1a3](https://github.com/astraldev/nanime/commit/696c1a3))
- Trim the comparison pages, add live previews, and write the 0.2.0 changelog ([bf86ff4](https://github.com/astraldev/nanime/commit/bf86ff4))
- Add branded OG image templates ([6926f4a](https://github.com/astraldev/nanime/commit/6926f4a))

### 🏡 Chore

- **module:** Drop unused lodash-es and tailwind-merge from optimizeDeps ([ed780c8](https://github.com/astraldev/nanime/commit/ed780c8))
- Add draft icon ([2533c5e](https://github.com/astraldev/nanime/commit/2533c5e))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.1.14

[compare changes](https://github.com/astraldev/nanime/compare/v0.1.13...v0.1.14)

### 🩹 Fixes

- **proxy:** Import reactive in the buffered proxy ([8b5c7bd](https://github.com/astraldev/nanime/commit/8b5c7bd))

### 💅 Refactors

- **composables:** Fix useScrambleText filename typo ([9617631](https://github.com/astraldev/nanime/commit/9617631))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.1.13

[compare changes](https://github.com/astraldev/nanime/compare/v0.1.12...v0.1.13)

### 🚀 Enhancements

- **scroll:** Add useAnimeScroll ([ceddef1](https://github.com/astraldev/nanime/commit/ceddef1))
- **config:** Make keepTime a module option ([eb5956e](https://github.com/astraldev/nanime/commit/eb5956e))

### 🔥 Performance

- **animate:** Rebuild only when targets or parameters actually change ([4621588](https://github.com/astraldev/nanime/commit/4621588))

### 🩹 Fixes

- **composables:** Preserve state across instance rebuilds ([16f6cbd](https://github.com/astraldev/nanime/commit/16f6cbd))
- **config:** Revert keepTime module default to false ([e8b1d25](https://github.com/astraldev/nanime/commit/e8b1d25))

### 💅 Refactors

- **proxy:** Split create-proxy into modules ([0f0dc5c](https://github.com/astraldev/nanime/commit/0f0dc5c))

### 📖 Documentation

- Fix missing blank line before changelog packaging heading ([515094b](https://github.com/astraldev/nanime/commit/515094b))
- **skill:** Ship a nanime skill for consumers ([dcdec7a](https://github.com/astraldev/nanime/commit/dcdec7a))
- **skill:** Correct the ref-unwrapping claim ([942d368](https://github.com/astraldev/nanime/commit/942d368))
- **examples:** Add the scroll road trip showcase ([5c3b5ef](https://github.com/astraldev/nanime/commit/5c3b5ef))
- **scroll:** Add useAnimeScroll page and demo ([95cc57d](https://github.com/astraldev/nanime/commit/95cc57d))
- **skill:** Add composable page spec ([f7ef38a](https://github.com/astraldev/nanime/commit/f7ef38a))
- **composables:** Restructure pages, fix API claims ([611d68a](https://github.com/astraldev/nanime/commit/611d68a))
- Rewrite guides, misc and examples for readability ([db146e9](https://github.com/astraldev/nanime/commit/db146e9))
- **changelog:** Add the unreleased entries ([f9e0fb6](https://github.com/astraldev/nanime/commit/f9e0fb6))
- **examples:** Fix prose issues across showcase pages ([a4d5c5c](https://github.com/astraldev/nanime/commit/a4d5c5c))
- Fact-check composables, redesign changelog, audit prose style ([b59d988](https://github.com/astraldev/nanime/commit/b59d988))
- **homepage:** Rework the hero demo into a responsive showcase box ([61f1f6b](https://github.com/astraldev/nanime/commit/61f1f6b))

### 🏡 Chore

- Restore automatic versioning in the release script ([e64af47](https://github.com/astraldev/nanime/commit/e64af47))
- Add v0.1.12 announcement copy ([a4d0a23](https://github.com/astraldev/nanime/commit/a4d0a23))

### ✅ Tests

- **config:** Cover the keepTime module option ([e5a44f8](https://github.com/astraldev/nanime/commit/e5a44f8))

### 🤖 CI

- Trigger release on published, allow manual dispatch ([c0b5362](https://github.com/astraldev/nanime/commit/c0b5362))
- Drop redundant comment on release trigger ([dad5e9a](https://github.com/astraldev/nanime/commit/dad5e9a))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.1.12

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.11...v0.1.12)

### 🚀 Enhancements

- **useDraggable:** Return buffered proxy instead of optional-method proxy ([db7b2bc](https://github.com/astraldev/nanime/commit/db7b2bc))

### 🔥 Performance

- **docs:** Optimize bundle size and remove runtime prettier ([83682db](https://github.com/astraldev/nanime/commit/83682db))

### 🩹 Fixes

- Unwrap ref in resolveNanimeInstance, expand buffered timer/timeline chainable methods ([289e281](https://github.com/astraldev/nanime/commit/289e281))
- Resolve h3-next module error, trailing comma, flaky mountSuspended test ([eef77a1](https://github.com/astraldev/nanime/commit/eef77a1))

### 💅 Refactors

- **src:** ⚠️  Drop transition components, add svg proxies + timer/animate utils ([7228931](https://github.com/astraldev/nanime/commit/7228931))
- Drop @vueuse/core from the runtime, fix the release pipeline ([8b151e2](https://github.com/astraldev/nanime/commit/8b151e2))

### 📖 Documentation

- **ai:** Include motion design skill for better animations ([b31be61](https://github.com/astraldev/nanime/commit/b31be61))
- Add drag-to-bin showcase example ([6e0b296](https://github.com/astraldev/nanime/commit/6e0b296))
- Homepage/preview updates, timeline-storyboard demo, transition-slide page ([c24caf4](https://github.com/astraldev/nanime/commit/c24caf4))
- Add examples showcase section, replacing components docs ([ff438aa](https://github.com/astraldev/nanime/commit/ff438aa))
- Drop components/prefix config docs, add useDraggable caveats ([b7c7a16](https://github.com/astraldev/nanime/commit/b7c7a16))
- Rewrite guides in a consistent prose voice, add performance page ([3c68ad3](https://github.com/astraldev/nanime/commit/3c68ad3))
- Update README with streamlined structure and documentation links ([128b692](https://github.com/astraldev/nanime/commit/128b692))
- Correct false claims in showcase pages, resizable example wrapper ([067eb43](https://github.com/astraldev/nanime/commit/067eb43))

### 📦 Build

- Update scripts for improved build II ([2cd56af](https://github.com/astraldev/nanime/commit/2cd56af))
- Update scripts for improved build III ([cd2a5da](https://github.com/astraldev/nanime/commit/cd2a5da))
- Migrate to pnpm catalogs and bump nuxt/test-utils ([329791d](https://github.com/astraldev/nanime/commit/329791d))
- Override h3 to ^1.15.11 to fix module resolution ([3ae3304](https://github.com/astraldev/nanime/commit/3ae3304))

### 🏡 Chore

- Remove playground ([7b1827c](https://github.com/astraldev/nanime/commit/7b1827c))
- **skills:** Update create-playground-page, add create-showcase-doc ([84fd7ce](https://github.com/astraldev/nanime/commit/84fd7ce))
- Ignore .claude directory ([19d5b12](https://github.com/astraldev/nanime/commit/19d5b12))

#### ⚠️ Breaking Changes

- **src:** ⚠️  Drop transition components, add svg proxies + timer/animate utils ([7228931](https://github.com/astraldev/nanime/commit/7228931))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.0.11

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.9...v0.0.11)

### 🚀 Enhancements

- **core:** Add NANIME_INSTANCE identification and createBufferedProxy utility ([085887b](https://github.com/astraldev/nanime/commit/085887b))
- **core:** Mark existing composable returns with NANIME_INSTANCE ([a197520](https://github.com/astraldev/nanime/commit/a197520))
- Add useAnimeTimeline composable and #nanime/proxies/text alias ([55686bd](https://github.com/astraldev/nanime/commit/55686bd))

### 📖 Documentation

- Update lockfile for nanime doc page builds ([2cad9f0](https://github.com/astraldev/nanime/commit/2cad9f0))
- Add useAnimeTimeline documentation page and example components ([7ae49f5](https://github.com/astraldev/nanime/commit/7ae49f5))
- Add animated AppHeaderLogo and rename misc index page ([6a7d1ff](https://github.com/astraldev/nanime/commit/6a7d1ff))
- Add useAnimeTimeline to composables index and update project config ([277da72](https://github.com/astraldev/nanime/commit/277da72))
- Open all external links in new tab ([8ff4ccc](https://github.com/astraldev/nanime/commit/8ff4ccc))
- Add note for proxies and updated changelogs ([029b24c](https://github.com/astraldev/nanime/commit/029b24c))

### 📦 Build

- Update package jsons for improved build ([e3fafcc](https://github.com/astraldev/nanime/commit/e3fafcc))

### 🏡 Chore

- **release:** V0.0.10 ([421ef66](https://github.com/astraldev/nanime/commit/421ef66))
- Update relevant agent skills + dedicated netlify build and prerender configs ([21ad739](https://github.com/astraldev/nanime/commit/21ad739))

### 🤖 CI

- Remove submodule requirement ([3f2eef0](https://github.com/astraldev/nanime/commit/3f2eef0))
- Update build deps for docs ([6631a84](https://github.com/astraldev/nanime/commit/6631a84))
- Update build deps for docs ([d0b7b51](https://github.com/astraldev/nanime/commit/d0b7b51))
- Update ci config for publishing ([cc3be1e](https://github.com/astraldev/nanime/commit/cc3be1e))
- Update ci config for publishing II ([f994404](https://github.com/astraldev/nanime/commit/f994404))
- Update ci config for publishing III ([a00a100](https://github.com/astraldev/nanime/commit/a00a100))
- Update ci config for publishing IV ([4052a58](https://github.com/astraldev/nanime/commit/4052a58))
- Update linkings I ([c48da49](https://github.com/astraldev/nanime/commit/c48da49))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.0.10

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.9...v0.0.10)

### 🤖 CI

- Remove submodule requirement ([3f2eef0](https://github.com/astraldev/nanime/commit/3f2eef0))
- Update build deps for docs ([6631a84](https://github.com/astraldev/nanime/commit/6631a84))
- Update build deps for docs ([d0b7b51](https://github.com/astraldev/nanime/commit/d0b7b51))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.0.9

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.8...v0.0.9)

### 🚀 Enhancements

- Add useScrambleText composable, remove useLayout ([fab70c3](https://github.com/astraldev/nanime/commit/fab70c3))

### 📖 Documentation

- Update config for studio and only use published nanime package for docs ([ef86b66](https://github.com/astraldev/nanime/commit/ef86b66))
- Update nuxt studio config ([009102c](https://github.com/astraldev/nanime/commit/009102c))
- Update composables homepage ([b81540f](https://github.com/astraldev/nanime/commit/b81540f))
- Update agent skills, rules, and documentation pages ([7fb6d67](https://github.com/astraldev/nanime/commit/7fb6d67))
- Improve documentation page ([2aaa651](https://github.com/astraldev/nanime/commit/2aaa651))

### 🏡 Chore

- Add CLAUDE.md, agent rules, composable workflow, and anime submodule ([a70351a](https://github.com/astraldev/nanime/commit/a70351a))
- Update dependencies and fix vueuse peer dep range ([6559962](https://github.com/astraldev/nanime/commit/6559962))

### 🤖 CI

- Issues again with linter ([fac98d9](https://github.com/astraldev/nanime/commit/fac98d9))
- Issues again with linter II ([dcb3cd4](https://github.com/astraldev/nanime/commit/dcb3cd4))

### ❤️ Contributors

- Ekure Edem <ekureedem480@gmail.com>

## v0.0.8

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.7...v0.0.8)

### 🚀 Enhancements

- Instant play support for calling inside utility functions ([fb90c9e](https://github.com/astraldev/nanime/commit/fb90c9e))
- Integrate nuxt studio ([7aa196a](https://github.com/astraldev/nanime/commit/7aa196a))

### 🩹 Fixes

- **#7:** Resolves wrong path ([cf81e9e](https://github.com/astraldev/nanime/commit/cf81e9e))

### 💅 Refactors

- Rename animation `options` to `parameters` and update related types and documentation. ([55d3874](https://github.com/astraldev/nanime/commit/55d3874))

### 📖 Documentation

- Improve documentation looks and links ([addde1b](https://github.com/astraldev/nanime/commit/addde1b))

### 🏡 Chore

- Pkg version updates ([8357b1a](https://github.com/astraldev/nanime/commit/8357b1a))

### ❤️ Contributors

- Ekure Edem

## v0.0.7

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.5-06...v0.0.7)

### 📖 Documentation

- Fix link issues on documentation pages ([4095c4d](https://github.com/astraldev/nanime/commit/4095c4d))
- **useDraggable:** Update draggable release ease ([f3a23f3](https://github.com/astraldev/nanime/commit/f3a23f3))
- Add view on github links for doc examples ([50d341e](https://github.com/astraldev/nanime/commit/50d341e))

### 🏡 Chore

- **release:** V0.0.6 ([71c4b92](https://github.com/astraldev/nanime/commit/71c4b92))
- Disable sourcemaps for doc builds ([d21d99b](https://github.com/astraldev/nanime/commit/d21d99b))
- Fix lint issues ([a983a22](https://github.com/astraldev/nanime/commit/a983a22))
- **imports:** Use explicit imports for vue plugin support ([f9fc7f7](https://github.com/astraldev/nanime/commit/f9fc7f7))

### 🤖 CI

- Fix docs page build ([04ba7e1](https://github.com/astraldev/nanime/commit/04ba7e1))
- Fix issue with nanime as built dep causing issues ([6cb2173](https://github.com/astraldev/nanime/commit/6cb2173))
- Remove postinstall script from package json ([8bcc857](https://github.com/astraldev/nanime/commit/8bcc857))

### ❤️ Contributors

- Ekure Edem

## v0.0.6

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.5-06...v0.0.6)

## v0.0.5

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.4...v0.0.5)

### 🚀 Enhancements

- **useDraggable:** Implement useDraggable composable and include documentation ([ed098af](https://github.com/astraldev/nanime/commit/ed098af))

### 🩹 Fixes

- Resolve import path issue; remove module logs ([bc679bb](https://github.com/astraldev/nanime/commit/bc679bb))

### 📖 Documentation

- Update documentation layout for better readability ([cfa0019](https://github.com/astraldev/nanime/commit/cfa0019))
- **useDraggable:** Update demo example ([453a1f6](https://github.com/astraldev/nanime/commit/453a1f6))
- **useDraggable:** Update doc format and example for better rendering ([36a685b](https://github.com/astraldev/nanime/commit/36a685b))

### 🏡 Chore

- Fix repository def in pkgjson ([1009af2](https://github.com/astraldev/nanime/commit/1009af2))
- Code lint + fix eslint violations ([bdce932](https://github.com/astraldev/nanime/commit/bdce932))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.0.4

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.2...v0.0.4)

### 🩹 Fixes

- **imports:** Remove plugin for `$anime` in favour of `#nanime/utils` import path ([3a7eb27](https://github.com/astraldev/nanime/commit/3a7eb27))
- **imports:** Resolve #nanime/utils import issue ([bd38590](https://github.com/astraldev/nanime/commit/bd38590))

### 📖 Documentation

- Update project name from nuxt-anime to nanime ([4206cae](https://github.com/astraldev/nanime/commit/4206cae))
- Update documentation index page ([f92a038](https://github.com/astraldev/nanime/commit/f92a038))
- Improve documentation pages config ([8a3d9b6](https://github.com/astraldev/nanime/commit/8a3d9b6))
- Use AI to scaffold documentation structure and initial texts ([0c9089f](https://github.com/astraldev/nanime/commit/0c9089f))
- Update page info for composables + extra skills ([6bb8cec](https://github.com/astraldev/nanime/commit/6bb8cec))
- Update documentation pages with working examples ([ff433a3](https://github.com/astraldev/nanime/commit/ff433a3))
- Add nanime to package deps for docs ([78b87e1](https://github.com/astraldev/nanime/commit/78b87e1))
- Update import path definitions ([ed7cbfb](https://github.com/astraldev/nanime/commit/ed7cbfb))
- Add renderer component for codeblocks, update import path for anime utils ([2a56541](https://github.com/astraldev/nanime/commit/2a56541))

### 🏡 Chore

- Update hero animation ([3d49f78](https://github.com/astraldev/nanime/commit/3d49f78))
- **release:** V0.0.3 ([977f73b](https://github.com/astraldev/nanime/commit/977f73b))

### 🤖 CI

- Add release build for nanime ([1360b4f](https://github.com/astraldev/nanime/commit/1360b4f))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.0.3

[compare changes](https://github.com/astraldev/nanime/compare/v0.0.2...v0.0.3)

### 🩹 Fixes

- **imports:** Remove plugin for `$anime` in favour of `#nanime/utils` import path ([3a7eb27](https://github.com/astraldev/nanime/commit/3a7eb27))

### 📖 Documentation

- Update project name from nuxt-anime to nanime ([4206cae](https://github.com/astraldev/nanime/commit/4206cae))
- Update documentation index page ([f92a038](https://github.com/astraldev/nanime/commit/f92a038))
- Improve documentation pages config ([8a3d9b6](https://github.com/astraldev/nanime/commit/8a3d9b6))
- Use AI to scaffold documentation structure and initial texts ([0c9089f](https://github.com/astraldev/nanime/commit/0c9089f))
- Update page info for composables + extra skills ([6bb8cec](https://github.com/astraldev/nanime/commit/6bb8cec))
- Update documentation pages with working examples ([ff433a3](https://github.com/astraldev/nanime/commit/ff433a3))

### 🏡 Chore

- Update hero animation ([3d49f78](https://github.com/astraldev/nanime/commit/3d49f78))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.0.2


### 🚀 Enhancements

- Initial commit + ssr safe useAnimatable & useAnimate ([165b633](https://github.com/astraldev/nanime/commit/165b633))
- Update proxy usage for animations, add useLayout + useWaapiAnimate ([768f456](https://github.com/astraldev/nanime/commit/768f456))
- Add `nanime` alias to nuxt ([9a5b69e](https://github.com/astraldev/nanime/commit/9a5b69e))
- Implement TransitionSlide component + update playground components ([e60dd78](https://github.com/astraldev/nanime/commit/e60dd78))
- Implement transition slide component + add playground components ([754a7b5](https://github.com/astraldev/nanime/commit/754a7b5))
- Add useSplitText component ([32e2083](https://github.com/astraldev/nanime/commit/32e2083))

### 🩹 Fixes

- **useSpitText:** Fixed issue with lines and chars not updating properly ([e3abe41](https://github.com/astraldev/nanime/commit/e3abe41))
- **useWaapiAnimate:** Fix typing issue with element lists ([fa4845d](https://github.com/astraldev/nanime/commit/fa4845d))

### 📖 Documentation

- Init docus for doc page creation ([018f293](https://github.com/astraldev/nanime/commit/018f293))

### 🏡 Chore

- Update docs + module name for easier search and usage ([dd43fb8](https://github.com/astraldev/nanime/commit/dd43fb8))
- **release:** V0.0.1 ([e09b988](https://github.com/astraldev/nanime/commit/e09b988))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

## v0.0.1


### 🚀 Enhancements

- Initial commit + ssr safe useAnimatable & useAnimate ([165b633](https://github.com/astraldev/nanime/commit/165b633))
- Update proxy usage for animations, add useLayout + useWaapiAnimate ([768f456](https://github.com/astraldev/nanime/commit/768f456))
- Add `nanime` alias to nuxt ([9a5b69e](https://github.com/astraldev/nanime/commit/9a5b69e))
- Implement TransitionSlide component + update playground components ([e60dd78](https://github.com/astraldev/nanime/commit/e60dd78))
- Implement transition slide component + add playground components ([754a7b5](https://github.com/astraldev/nanime/commit/754a7b5))
- Add useSplitText component ([32e2083](https://github.com/astraldev/nanime/commit/32e2083))

### 🏡 Chore

- Update docs + module name for easier search and usage ([dd43fb8](https://github.com/astraldev/nanime/commit/dd43fb8))

### ❤️ Contributors

- Ekure Edem ([@astraldev](https://github.com/astraldev))

