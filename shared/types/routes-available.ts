export interface RoutesAvailable {
  id: number;
  name: string;
  screenName: string;
  display: boolean;
  icon?: string; // the optional MDI icon representing the route
  showChildren?: boolean;
  children?: ChildRoute;
  asNuxtLink?: boolean;
}

export interface RouteMetadata {
  screenName: string;
}

export type ChildRoute = RoutesAvailable[];
