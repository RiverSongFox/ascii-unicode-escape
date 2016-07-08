//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import * as assert from 'assert';
import {Escaper, MODE} from '../src/escaper';

suite("Extension Tests", () => {

    const sample = "القط";
    const sample_esc = "\\u0627\\u0644\\u0642\\u0637";

    const sample_es6 = "\u{1f3c3}";
    const sample_es6_esc = "\\u{1f3c3}";

    let escaper = new Escaper();

    // Defines a Mocha unit test
    test("Escaping", () => {
        assert.equal(sample_esc, escaper.escape(sample));
    });

    test("Unescaping", () => {
        assert.equal(sample, escaper.unescape(sample_esc));
    });

    test("Unescaping ES6 literal", () => {
        assert.equal(sample_es6, escaper.unescape(sample_es6_esc));
    });

});
