export interface Performer {
    email: string;
    id: number;
    name: string;
    photo_id: number;
    rating: PerformerRating;
}

export interface PerformerRating {
    better_than: number;
    politeness: number;
    quality: number;
    speed: number;
    tasks_count: number;
    total: number;
}

export interface PerformerSkills {
    name: string;
    skills: Skills[];
}

export interface Skills {
    name: string;
    id: number;
    files: number[];
}

export interface PerformerTools {
    description: string;
    name: string;
}

export interface Regions {
    id: number;
    locality_type: number;
    name_geocoded: string;
    short_name: string;
    timezone: string;
}

export interface PerformerPassport {
    birthday: string;
    firstName: string;
    isPassportValid: boolean;
    passportScans: PassportFiles;
    passport_date: string;
    passport_podr: string;
    passport_serial: string;
    secondName: string;
    thirdName: string;
}

export interface PassportFiles {
    GPS: GPS;
    display_name: string;
    id: number;
    is_viewed_by_user: boolean;
    mime: string;
    size: string;
    upload_date: string;
    url: string;
}

export interface GPS {
    exist: boolean;
    coordinates?: Coordinates;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface StatusFavorite {
    isFavorite: boolean;
}
