// Edit routine wording and timings here. Durations are in seconds; each routine should total 300.
export type Step = { title: string; seconds: number; text: string; breathing?: boolean };
export type Routine = { id: string; name: string; description: string; steps: Step[] };

export const routines: Routine[] = [
  {
    id: "slow-breathing",
    name: "Slow breathing",
    description: "For when everything feels a bit much.",
    steps: [
      { title: "Settle in", seconds: 30, text: "Sit or lie somewhere comfortable. Let your shoulders drop and your hands rest." },
      { title: "Breathe in for 4, out for 6", seconds: 180, breathing: true, text: "Follow the circle. Breathe in through your nose as it grows, and out slowly as it shrinks." },
      { title: "Notice", seconds: 60, text: "Breathe normally. Notice where your body feels softer than when you began." },
      { title: "Close gently", seconds: 30, text: "Wiggle your fingers and toes, then open your eyes when you are ready." },
    ],
  },
  {
    id: "gentle-stretches",
    name: "Gentle stretches",
    description: "Easy movements you can do in a chair or on the bed.",
    steps: [
      { title: "Neck rolls", seconds: 60, text: "Drop your chin to your chest and slowly roll your head from side to side. Keep it small and easy." },
      { title: "Shoulder circles", seconds: 60, text: "Lift your shoulders up, back and down in slow circles. Change direction halfway." },
      { title: "Seated twist", seconds: 60, text: "Sit tall, turn gently to one side with a hand on the back of the chair, then swap sides." },
      { title: "Fold forward", seconds: 60, text: "Let your arms and head hang forward, knees soft. Breathe slowly and let it feel heavy." },
      { title: "Rest", seconds: 60, text: "Sit back and place a hand on your tummy. Notice your breath and let your body settle." },
    ],
  },
  {
    id: "treat-yourself",
    name: "Treat-yourself ritual",
    description: "A small, warm moment that is just for you.",
    steps: [
      { title: "Warm something up", seconds: 60, text: "Make a warm drink or hold a warm mug. Let your hands soak up the warmth." },
      { title: "Look after your hands", seconds: 90, text: "Rub your hands together, then smooth in a little of your favourite lotion or oil if you have one you already use. Take your time." },
      { title: "Choose a song", seconds: 90, text: "Put on one song you love. Sit or sway to it, and let your mind wander." },
      { title: "Write a kind line", seconds: 60, text: "Write one kind sentence to yourself, as you would for a friend who had a tiring day." },
    ],
  },
  {
    id: "hard-day-reset",
    name: "Hard day reset",
    description: "A quick way to feel steadier and look ahead.",
    steps: [
      { title: "Name how you feel", seconds: 60, text: "Say it in a few words, out loud or on paper. No fixing, just naming." },
      { title: "Drink some water", seconds: 60, text: "Fill a glass and sip slowly. Notice the cool and the calm." },
      { title: "Move a little", seconds: 60, text: "Stand up, shake out your arms and legs, and walk to a window if you can." },
      { title: "Three good things", seconds: 60, text: "Think of three small things that were fine or good today, however tiny." },
      { title: "One small next step", seconds: 60, text: "Choose one easy thing for the next hour, such as a snack, a shower or an early night." },
    ],
  },
  {
    id: "cosy-up",
    name: "Cosy-up",
    description: "Blankets, warmth and a slow, soft pause.",
    steps: [
      { title: "Gather your comforts", seconds: 60, text: "Fetch a blanket, a cushion and something warm to hold, like a mug of your favourite drink." },
      { title: "Get settled", seconds: 60, text: "Wrap up and find the most comfortable position. Let the blanket and cushion take your weight." },
      { title: "Hand on tummy breathing", seconds: 90, text: "Rest a hand on your tummy and breathe slowly. Feel it rise and fall under your hand." },
      { title: "Something gentle", seconds: 90, text: "Listen to calm music or a favourite podcast, or just watch the window. Nothing to do but be cosy." },
    ],
  },
  {
    id: "wind-down",
    name: "Wind-down for sleep",
    description: "A quiet five minutes before bed.",
    steps: [
      { title: "Soften from toes to head", seconds: 120, text: "Starting at your toes, tighten each part of your body for a moment, then let it go. Move slowly up through legs, tummy, hands, shoulders and face." },
      { title: "Slow breaths", seconds: 90, breathing: true, text: "Breathe in gently for 4 and out slowly for 6. Let each breath out be a little longer than the last." },
      { title: "Let go", seconds: 30, text: "Let your whole body rest just as it is. There is nothing more to do, and nowhere else to be." },
      { title: "Dim and put away", seconds: 60, text: "Now the routine is finished: turn the lights down low and put your phone face down, out of reach. Let that be your signal that the day is done." },
    ],
  },
];
