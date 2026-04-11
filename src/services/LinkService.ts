import { nanoid } from "nanoid";

export const generateShortCode = (): string => {
    return nanoid(7);
};