import { assert } from "chai";
import { checkDir, ensureDir, getExcels, removeDir } from "../lib/util";

describe(`test suit`, () => {
    it(`util`, async () => {
        removeDir("./dist/temp");
        assert.isTrue(checkDir("./dist"));
        assert.equal(getExcels("./src/tests/excel").length, 4);
        assert.isFalse(checkDir("./dist/temp"));
        ensureDir("./dist/temp");
        assert.isTrue(checkDir("./dist/temp"), "temp dir should created");
        removeDir("./dist/temp");
        assert.isFalse(checkDir("./dist/temp"), "temp dir should be removed");
    });
});