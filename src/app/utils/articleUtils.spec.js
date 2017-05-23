import articleUtils from "../utils/articleUtils";

describe('article utils', function() {
    describe('converting an article title to a firebase key', () => {
        it('should not do anything to single word', () => {
            expect(articleUtils.getKeyForTitle("Cats")).to.equal("Cats");
        });

        it('should trim a word', () => {
            expect(articleUtils.getKeyForTitle("  Cats  ")).to.equal("Cats");
        });

        it('should replace spaces with dashes', () => {
            expect(articleUtils.getKeyForTitle("All about dinosaurs")).to.equal("All-about-dinosaurs");
        });

        it('should not replace dashes', () => {
            expect(articleUtils.getKeyForTitle("All-about-dinosaurs")).to.equal("All-about-dinosaurs");
        });

        it('should leave percentages alone', () => {
        	const res = "50%25-of-people-don\'t-like-chocolate";
            expect(articleUtils.getKeyForTitle("50% of people don't like chocolate")).to.equal(res);
        });
    });
});
