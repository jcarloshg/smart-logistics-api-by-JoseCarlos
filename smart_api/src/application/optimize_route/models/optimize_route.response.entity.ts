export interface OptimizeRouteResponse {
    graphId: string;
    totalCost: number;
    path: string[];
    durationMs?: number;
}
