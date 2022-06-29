import { isValidAuthHeaderFormat, isAuthHeaderValid } from '../sessionvalidation.middleware';

describe('isValidAuthHeaderFormat', () => {
    it('should return false if auth header is undefined', () => {
        expect(isValidAuthHeaderFormat(undefined)).toBe(false);
    });
    it('should return false if auth header is empty string', () => {
        expect(isValidAuthHeaderFormat('')).toBe(false);
    });
    it('should return false if auth header does not contin Bearer keyword', () => {
        expect(isValidAuthHeaderFormat('some incorrect key')).toBe(false);
    });
    it('should return false if auth header only contin Bearer keyword', () => {
        expect(isValidAuthHeaderFormat('Bearer ')).toBe(false);
    });
    it('should return true if auth header is in correct format', () => {
        expect(isValidAuthHeaderFormat('Bearer asdasasd!223D')).toBe(true);
    });
});

describe('isAuthHeaderValid', () => {
    it('should return true if jwt token is valid', () => {
        expect(isAuthHeaderValid('Bearer eyJhbGciOiJSUzI1NiJ9.eyJJc3N1ZXIiOiJEdW1teUlzc3VlciIsIlJvbGUiOiJWaXNpdG9yIiwiZXhwIjo0MTAyMzc2NDAwMDAwfQ.IE4KJyHyGqC6JFaixwRmJaObduY2p_qyEnLMHB5b8pNHO5tRGLHTknEanbbm101ETbz1wUnX9SOTI3oRCSvwY0n5O5hmLPFeMkP3b015CN7RXxOub8AlOoEBRa-x74TOhdDpgL-GrTpqG-lXzmoqC0SbhV25fUFMWO6El9iEQdpXBVrJ8tEB5fd42vzDcjvMbLVG0N74LgzjQLpBAE3bORTelP7S3qLuE_lwswzdqFeMfWqmJpBZ8C9vOWXQG7VeaVUhPq9a7r-mFJDV5waXHawWP2mb0hp9X29zNNN9fafTULM9rjy9U-sa4f_SGUmx7W14ES5rrq3yugkDP9YWoQ')).toBe(true);
    });

    it('should throw error if the token is not able to be decoded', () => {
        expect(() => {
            isAuthHeaderValid('Bearer DFSFDS!@#!fdvd')
        }).toThrow();
    });

    it('should return false if jwt token values are not match', () => {
        expect(isAuthHeaderValid('Bearer eyJhbGciOiJIUzI1NiJ9.eyJJc3N1ZXIiOiJJc3N1ZXIifQ.HLkw6rgYSwcv0sE69OKiNQFvHoo-6VqlxC5nKuMmftg')).toBe(false);
    })
});