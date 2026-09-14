# Antigravity Memory & Error Log

## Key User Preferences & Design Constraints
1. **Fonts**: Strictly standard, clean sans-serif font (`font-sans`) everywhere. Never use cursive or `font-handwritten` fonts for Bone AI.
2. **Theme Aesthetics**: Premium Bixby/Samsung One UI style — frosted glassmorphism (`backdrop-blur-2xl`), translucent dark cards (`bg-[#161822]/95` or `bg-black/40`), subtle glowing gradients, smooth curves (`rounded-3xl` / `rounded-full`).
3. **Sidebar Layout**:
   - Top row: `[ ☰ ]` hamburger menu on the left, and `[💬+]` New Conversation compose button (`MessagePlusIcon`) on the right in place of Settings.
   - Settings icon, Notices, and large "New conversation" pill button are removed.
   - Directly underneath top row is the `Conversations` collapsible list.
   - Single unified sidebar across desktop and mobile. On mobile, slides as a drawer from the left when clicking the 3-lines button.
4. **Chat Area Styling**:
   - No horizontal "Today" date divider line in the messages feed. Clean, seamless flow from header to messages.
4. **Mobile Responsiveness**:
   - On mobile screens, hide TopBar and bottom navigation for distraction-free Bixby mode.
   - Header shows `[ ☰ ]  Bone AI` on the left and `[💬+]` compose icon on the right.
   - Clicking the 3 lines hamburger menu opens a floating, rounded sidebar drawer that slides in from the left (`translate-x-0` vs `-translate-x-[120%]`).
   - Sidebar is slidable: swipe left closes the sidebar, swipe right from screen edge opens it, tapping backdrop closes it.
5. **AI Quality**:
   - Chat history must be passed to Gemini/NVIDIA API so answers are dynamic and do not repeat.
   - No hardcoded repetitive fallback answers.

## Mistakes & Fixes Log
- *Mistake*: Creating a separate duplicate mobile sidebar component instead of making the existing sidebar responsive.
  *Fix applied*: Removed duplicate sidebar code. Unified into a single sidebar in `BoneAIPage.tsx` that docks on desktop and smoothly slides as a drawer on mobile with swipe and backdrop dismissals.
- *Mistake*: An unintended rollback caused Bone AI to temporarily show the old "Bone AI Assistant" card instead of the user's custom Bixby design.
  *Fix applied*: Restored the user's exact design with colorful "Bone AI" gradient title, "You can say", the 3 pill prompt buttons, the MessagePlusIcon compose button, and the mobile slidable sidebar drawer. Verified across desktop and mobile.
- *Mistake*: Syntax error with extra parentheses in JSX caused Vite HMR to fail with pre-transform parse error.
  *Fix applied*: Validated syntax and ensured `npx tsc --noEmit` passes with 0 errors before finishing.
- *Mistake*: Sidebar left too much empty space at bottom.
  *Fix applied*: Used responsive height `h-[100dvh] lg:h-[calc(100vh-48px)]` and tight margin `mb-2` so the floating pill stretches properly to the bottom.
- *Mistake*: Missing mobile sliding drawer for Bone AI.
  *Fix applied*: Implemented sliding drawer with backdrop and touch swipe gesture handlers.

- *Mistake*: AI was returning the exact same generic template response ("1. Core Concept & Definition - Establishing clear definitions is essential...") for every query.
  *Root Causes & Fix applied*:
  1. `isValidKey` validator explicitly rejected keys starting with `AQ.` (`!k.startsWith('AQ.')`), which rejected the active Gemini API key in `.env`. Removed this check so `AQ.` keys are accepted.
  2. `callGemini` previously used single deprecated/rate-limited model without fallbacks. Updated to cascade through active candidate models (`gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-flash-lite-latest`, `gemini-pro-latest`).
  3. `synthesizeEdTechResponse` had a static repetitive template with boilerplate text. Replaced it with context-aware, topic-specific educational content.
  4. Updated `.env` with `VITE_BONE_AI_MODEL=gemini-3.6-flash` and `VITE_NVIDIA_MODEL=meta/llama-3.2-11b-vision-instruct`.

- *Mistake*: Mobile bottom nav bar was showing on all pages (including Flashcards) and overlapping the floating Bone AI bubble.
  *Fix applied*:
  1. Restricted `MobileBottomNav` to only display on selected routes: `['home', 'videos', 'tools']`. Removed `Cards` (flashcards) from the bottom navigation items.
  2. Dynamically elevated the floating Bone AI bubble to `bottom: 104px` whenever the mobile bottom bar is present, ensuring clear separation without any overlap. On pages without the bottom bar (e.g. Flashcards) and on desktop, it sits at `24px`.

## Golden Milestone Status
- **CONFIRMED PERFECT (2026-09-15)**: Bone AI chat engine, Gemini 3.6 Flash streaming, Bixby UI with slidable drawer, custom `MessagePlusIcon` compose button, toolbox popover with upload & web link insertion, `Link` embedded tool inside `/tools`, mobile bottom bar restriction (`home`, `videos`, `tools`), and floating AI bubble position (`bottom: 104px` with bottom bar, `24px` without) are all **working 100% perfectly**.

## Future Pending Tasks
- Add animated speech wave equalizer when voice input is active.
- Expand session search and export functionality in sidebar.
