import articleUtils from "../utils/articleUtils";

describe('article utils', function() {
    describe('converting an article title to a firebase key', () => {
        it('should not do anything to single word', () => {
            expect(articleUtils.getKeyForTitle("Cats")).to.equal("Cats");
        });

        it('should trim a word', () => {
            expect(articleUtils.getKeyForTitle("  Cats  ")).to.equal("Cats");
        });

        it('should replace spaces with underscores', () => {
            expect(articleUtils.getKeyForTitle("All about dinosaurs")).to.equal("All_about_dinosaurs");
        });

        it('should replace dashes with underscores', () => {
            expect(articleUtils.getKeyForTitle("All-about-dinosaurs")).to.equal("All_about_dinosaurs");
        });

        it('should replace percent symbol with word percent', () => {
        	const res = "50_percent_of_people_don\'t_like_chocolate";
            expect(articleUtils.getKeyForTitle("50% of people don't like chocolate")).to.equal(res);
        });
    });
});
