
export interface EmailValidationResult {
  email: string;
  isValid: boolean;
  syntaxOk: boolean;
  score: number; // 0-100
  analysis: string;
  provider: string;
  isDisposable: boolean;
  possibleTypos: string[];
  category: 'personal' | 'business' | 'disposable' | 'invalid';
}

export interface BatchStats {
  total: number;
  valid: number;
  invalid: number;
  disposable: number;
  business: number;
}
