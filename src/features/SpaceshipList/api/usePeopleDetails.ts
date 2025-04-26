import { useQueries } from "@tanstack/react-query";

interface Person {
    name: string;
    url: string;
}

export const usePeopleDetails = (peopleIds: string[]) => {
    const queries = peopleIds.map((id) => ({
        queryKey: ["person", id],
        queryFn: async () => {
            const response = await fetch(
                `https://swapi.py4e.com/api/people/${id}/`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch person details");
            }
            const data: Person = await response.json();
            return data;
        },
        enabled: !!id,
    }));

    return useQueries({ queries });
};
