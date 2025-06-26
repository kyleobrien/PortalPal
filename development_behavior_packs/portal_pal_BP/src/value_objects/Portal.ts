export interface Portal {
    id: string;
    name: string;
    color: number;
    private: boolean;
    location: { x: number;
                y: number;
                z: number; }
    dimension: string;
}
