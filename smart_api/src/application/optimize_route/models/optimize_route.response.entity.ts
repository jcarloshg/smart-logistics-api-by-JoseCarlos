import { Preference } from "./optimize_route_request.entity";

export interface OptimizeRouteResponse {
    graphId: string;
    totalCost: number;
    path: string[];
    durationMs?: number;
    preference?: Preference;
}
