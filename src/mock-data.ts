import { Notebook, UserSettings } from "./types";

export let defaultUserSettings: UserSettings = {
  separator: {
    before: "...",
    after: " ",
  },
  darkMode: false,
};

export let notebooks: Notebook[] = [
  {
    id: "1",
    title: "philosophy",
    content:
      "The other extreme to be avoided, he said, is indulgence in sense pleasures — being possessed by sexual desire, running after fame, eating immoderately, sleeping too much, or chasing after possessions.",
  },
  {
    id: "2",
    title: "love",
    content: "Relationships are meant to be comfort zones, not war zones",
  },
  {
    id: "3",
    title: "lyrics",
    content: `You've killed the saint in me
How dare you martyr me?

Unsainted - Slipknot
`,
  },
];
