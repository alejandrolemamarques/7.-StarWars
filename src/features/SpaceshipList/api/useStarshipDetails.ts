import { useQuery } from "@tanstack/react-query";
import { Starship } from "../types/starship";

export const useStarshipDetails = (url: string) => {
    return useQuery({
        queryKey: ["starship", url],
        queryFn: async () => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch starship details");
            }
            const data: Starship = await response.json();
            return data;
        },
        enabled: !!url,
    });
};
