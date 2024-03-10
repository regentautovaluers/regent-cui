export type ApplicationChildRoute = {
    id: number;
    displayName: string;
    routeName: string;
};

export type ApplicationRoute = {
    id: number;
    displayName: string;
    icon: string;
    routeName: string;
    children?: ApplicationChildRoute[];
};