export interface Notebook {
  id: string;
  title: string;
  content: string;
}

export interface UserSettings {
  separator: {
    before: string;
    after: string;
  };
  darkMode: boolean;
}
