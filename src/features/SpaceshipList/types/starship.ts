export interface StarshipSummary {
    name: string;
    url: string;
}

export interface Starship {
    name: string;
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    hyperdrive_rating: string;
    starship_class: string;
    url: string;
    films: string[];
    pilots: string[];
}

export interface StarshipResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Starship[];
}
