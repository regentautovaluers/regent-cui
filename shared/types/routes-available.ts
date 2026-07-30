export interface RoutesAvailable {
  id: number;
  name: string;
  screenName: string;
  display: boolean;
  icon?: string; // the optional MDI icon representing the route
  children?: ChildRoute;
}

export interface RouteMetadata {
  screenName: string;
}

export type ChildRoute = RoutesAvailable[];
