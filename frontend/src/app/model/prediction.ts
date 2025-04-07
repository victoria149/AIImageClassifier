export interface Score{
    label: string;
    score: number;
}

export interface Prediction {
    prediction: string;
    scores: Score[];
}