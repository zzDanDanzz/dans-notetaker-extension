export interface Notebook {
  id: string;
  title: string;
  content: string;
  timestamps: {
    created: number;
    updated: number;
  };
}

export interface UserSettings {
  separator: {
    before: string;
    after: string;
  };
  darkMode: boolean;
}
