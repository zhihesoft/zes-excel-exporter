import { assert } from "chai";
import { checkDir } from "../lib/util";

describe(`test suit`, () => {
    it(`util`, async () => {
        assert.isTrue(checkDir("./dist"));
    });
});