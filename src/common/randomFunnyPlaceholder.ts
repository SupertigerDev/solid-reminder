const ReminderNotePlaceholderMessages = [
  "Get some milk",
  "Drink water",
  "Do some exercise",
  "Take some pills",
  "Get some sleep",
  "Get some water",
  "Get off Overwatch, and get some sleep",
  "Pay bills",
  "Get some food",
  "Go have a bath",
  "Go to a party",
  "Call your mom",
  "Watch cat videos",
  "Pretend to be productive",
  "Take a nap",
  "Write a novel in one sitting",
  "Learn to juggle",
  "Binge-watch your favorite show",
  "Organize your sock drawer",
  "Practice your air guitar skills",
  "Have a staring contest with the mirror",
  "Invent a new recipe",
  "Daydream about vacation",
  "Do a random act of kindness",
  "Sing in the shower",
  "Plan a prank",
];

export const RandomReminderNotePlaceholder = () => {
  const index = Math.floor(
    Math.random() * ReminderNotePlaceholderMessages.length
  );
  return ReminderNotePlaceholderMessages[index];
};
