// src/types/cocktail.ts
export interface Cocktail {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    isAvailable: boolean;
    ingredients?: string[];
    instructions?: string;
    origin?: string;
    status?: string;
}