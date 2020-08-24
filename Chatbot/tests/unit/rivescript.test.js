// require dialog manager
const _ = require("../../src/dialogue-manager/rivescript/rivescript");

describe("Dialogue manager validator", () => {

    it('should return always the same instance of the dialogue manager ',  () => {
        expect(new _().getInstance()).toBe(new _().getInstance());
    });

    afterAll(() => {
        // close redis connection
        new _().getInstance().sessionManager._client.quit();
    });

});
