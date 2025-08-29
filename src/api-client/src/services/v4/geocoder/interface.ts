export interface Address {
    addressOriginal: string;
    addressPoint: Point;
}

export interface Point {
    latitude: number;
    longitude: number;
}

export interface PolygonInfo {
    id: number;
    parentId: number;
    nameGeocoded: string;
    shortName: string;
    localityType: number;
    isBigCity: boolean;
}

export interface PolygonCoordinates {
    geometryJson: string;
}
