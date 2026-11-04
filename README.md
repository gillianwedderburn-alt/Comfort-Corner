# Comfort Corner

Build a mobile-first web app called "Comfort Corner" for the natural skincare brand Tandrewphen Pure. It is a calm page of six timed 5-minute routines that mums and teens can follow along with. No login, no backend, no database, no analytics, and nothing stored or sent anywhere. Keep everything in React state.

BRAND AND LOOK
- Warm, soft and calm. Background creamy yellow #feedaa. Cards a slightly lighter cream (#fff8dc). Text dark brown #50291f. Primary buttons and progress ring in orange #ffa948 with dark brown text. Secondary accents sage #B9D3C5 and olive #778642.
- Fonts: Playfair Display for headings, Jost for body text (a Futura-style face). Load both from Google Fonts.
- Fully responsive, comfortable on a phone. Large tap targets, visible keyboard focus, respect prefers-reduced-motion, and provide a dark mode that follows the device setting (dark brown background, cream text, same orange accent).
- Use sentence case, plain friendly language and British English. No emojis in the interface.

HOME SCREEN
- Small brand line "Tandrewphen Pure", then the title "Comfort Corner" and the line: "Five minutes, one gentle routine. Pick what suits the day, press start, and follow along."
- A sage panel titled "For mums", open by default and collapsible, with this text:
  "Comfort Corner is designed so you and your daughter can use it together, or so she can use it on her own when she needs a quiet moment. Hard days come with growing up, and a few calm minutes can help everyone feel steadier."
  Bullets:
  - Let her choose the routine. Feeling in control is part of the comfort.
  - Try one yourself first, or do it side by side. It works just as well for grown-ups.
  - Keep it light. There is no right way to do it and no score to beat.
  - Afterwards, ask "How was that?" rather than "Are you okay?". It is an easier question to answer.
  Then: "These routines are for rest and comfort only. If your daughter is in pain that worries you, or something does not feel right, please speak to your GP or pharmacist. Nothing is stored or sent from this page, so her check-ins stay private."
- Six routine cards in a single column (two columns on wide screens). Each card shows the routine name, a one-line description and a "5 minutes" tag.
- Footer note: "These routines are for rest and comfort. They are not medical advice. Move gently, stop any stretch that hurts, and speak to a pharmacist or your GP if something worries you. Nothing you do here is saved or sent anywhere."

ROUTINE PLAYER SCREEN
- A "Back to routines" link, the routine name, and a large circular progress ring (SVG) that fills smoothly over the whole 5 minutes, with a countdown clock (m:ss) in the centre.
- Below the ring: a segmented progress bar with one segment per step (done, current, upcoming), the current step title, and the step instruction.
- Buttons: Start / Pause / Resume, "Next step" (skips to the next step) and "Restart".
- Steps advance automatically when their time runs out. At the end show "All done" and "Well done for taking five minutes. Carry that calm into the rest of your day." with a "Choose another routine" button.
- Use a 1-second timer that cleans up properly when leaving the screen. Keep the timer accurate if the tab is briefly in the background (calculate from timestamps rather than counting ticks).
- For any step marked BREATHING, show a sage circle in the middle of the ring that grows while the label says "Breathe in" (first 4 seconds of each 10-second cycle) and shrinks while the label says "Breathe out" (next 6 seconds). With reduced motion on, keep the labels but do not animate the size.
- Optional, off by default: a small "Soft chime between steps" toggle that plays a gentle generated tone using the Web Audio API. No audio files.

THE SIX ROUTINES (durations in seconds, each totals 300)

1. Slow breathing. "For when everything feels a bit much."
   - Settle in (30): Sit or lie somewhere comfortable. Let your shoulders drop and your hands rest.
   - Breathe in for 4, out for 6 (180) [BREATHING]: Follow the circle. Breathe in through your nose as it grows, and out slowly as it shrinks.
   - Notice (60): Breathe normally. Notice where your body feels softer than when you began.
   - Close gently (30): Wiggle your fingers and toes, then open your eyes when you are ready.

2. Gentle stretches. "Easy movements you can do in a chair or on the bed."
   - Neck rolls (60): Drop your chin to your chest and slowly roll your head from side to side. Keep it small and easy.
   - Shoulder circles (60): Lift your shoulders up, back and down in slow circles. Change direction halfway.
   - Seated twist (60): Sit tall, turn gently to one side with a hand on the back of the chair, then swap sides.
   - Fold forward (60): Let your arms and head hang forward, knees soft. Breathe slowly and let it feel heavy.
   - Rest (60): Sit back and place a hand on your tummy. Notice your breath and let your body settle.

3. Treat-yourself ritual. "A small, warm moment that is just for you."
   - Warm something up (60): Make a warm drink or hold a warm mug. Let your hands soak up the warmth.
   - Look after your hands (90): Rub your hands together, then smooth in a little of your favourite lotion or oil if you have one you already use. Take your time.
   - Choose a song (90): Put on one song you love. Sit or sway to it, and let your mind wander.
   - Write a kind line (60): Write one kind sentence to yourself, as you would for a friend who had a tiring day.

4. Hard day reset. "A quick way to feel steadier and look ahead."
   - Name how you feel (60): Say it in a few words, out loud or on paper. No fixing, just naming.
   - Drink some water (60): Fill a glass and sip slowly. Notice the cool and the calm.
   - Move a little (60): Stand up, shake out your arms and legs, and walk to a window if you can.
   - Three good things (60): Think of three small things that were fine or good today, however tiny.
   - One small next step (60): Choose one easy thing for the next hour, such as a snack, a shower or an early night.

5. Cosy-up. "Blankets, warmth and a slow, soft pause."
   - Gather your comforts (60): Fetch a blanket, a cushion and something warm to hold, like a mug of your favourite drink.
   - Get settled (60): Wrap up and find the most comfortable position. Let the blanket and cushion take your weight.
   - Hand on tummy breathing (90): Rest a hand on your tummy and breathe slowly. Feel it rise and fall under your hand.
   - Something gentle (90): Listen to calm music or a favourite podcast, or just watch the window. Nothing to do but be cosy.

6. Wind-down for sleep. "A quiet five minutes before bed."
   - Dim and put away (60): Turn the lights down low and put your phone face down, out of reach.
   - Soften from toes to head (120): Starting at your toes, tighten each part of your body for a moment, then let it go. Move slowly up through legs, tummy, hands, shoulders and face.
   - Slow breaths (90) [BREATHING]: Breathe in gently for 4 and out slowly for 6. Let each breath out be a little longer than the last.
   - Settle (30): Get comfortable, close your eyes and let the day go. You can stop here and drift off.

KEEP IT COSMETIC AND CALM
- Do not add any wording about treating, relieving, curing or fixing anything, and do not mention any specific products or prices. This is about rest and comfort only.
- Do not add accounts, cookies, tracking, comments or forms.

OPTIONAL ACCESS CODE (build this as a simple setting I can switch off)
- Before the home screen, show a short screen: "Welcome to Comfort Corner. Enter your access code from your order email." with one input and a "Continue" button. The code is a single constant at the top of the code file that I can change. Remember a correct entry for the browser session only (sessionStorage is fine). Include a small line: "Lost your code? Email tandrewphenpure@gmail.com."

TECHNICAL
- React with TypeScript and Tailwind, as Lovable normally builds. Keep the routine data in one easily editable file so I can change wording and timings later.
- Set the page title to "Comfort Corner | Tandrewphen Pure" and add a sensible meta description and favicon.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/14ba712b-6293-448a-82bd-90b6eb9c4706).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
