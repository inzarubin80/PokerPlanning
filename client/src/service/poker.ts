import http from "./http-common";

const create = () => {
    return http.post("/poker");
};

export const PokerService = {
    create,
};