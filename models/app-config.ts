export type Segmento = 'free' | 'premium';

export type AppConfig = {
  segmento: Segmento | null;
  key: string;
  value: string;
};

