
export type User = {
    uid: string;
    displayName: string; 
    displayImgUrl?: string;
    email: string;
    roles: string[];
    
    totalPoints: number;
    individualPoints: Record<string, number>;
}