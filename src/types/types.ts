export interface UserProfile {
    id: string;
    email: string;
    name: string;
    picture: string;
  }

  export interface UserState {
    access_token: string | null;
    profile: UserProfile | null;
    id: string | null;
  }

  export interface TranslateText {
    translation: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;

  }



  export interface translation {
    Translation: string;
    Text: string;
    TranslationKey: string
  }

  export interface GameContent {
    question: string;
    options: string[];
    answer: string;
}