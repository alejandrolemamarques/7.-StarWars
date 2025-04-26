import { useQuery } from "@tanstack/react-query";
import { StarshipResponse } from "../types/starship";

// Exported fetch function
export const fetchStarships = async (
    page: number
): Promise<StarshipResponse> => {
    const response = await fetch(
        `https://swapi.py4e.com/api/starships/?page=${page}&limit=9`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch starships");
    }
    const data: StarshipResponse = await response.json();
    return data;
};

export const useStarships = (page: number = 1) => {
    return useQuery({
        queryKey: ["starships", page],
        queryFn: () => fetchStarships(page), // Use the exported function here
    });
};
