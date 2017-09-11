import photoUtils from "../utils/photoUtils";

describe('photo utils', function() {
    describe('converting an image title to a firebase key', () => {
        it('should take out characters not allowed in firebase keys', () => {
            expect(photoUtils.getKeyForPhotoName("Cats.#$[]")).to.equal("Cats");
        });
    });
});
