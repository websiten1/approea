export interface BishopWord {
  id: string;
  title: string;
  /** format ISO: YYYY-MM-DD */
  date: string;
  excerpt: string;
  body: string;
  imageUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  /** format ISO: YYYY-MM-DD */
  date: string;
  excerpt: string;
  body: string;
  imageUrl?: string;
}

export interface SoliaIssue {
  id: string;
  number: number;
  title: string;
  /** format ISO: YYYY-MM-DD */
  date: string;
  coverUrl?: string;
  pdfUrl?: string;
}
