var expect = require('expect');

var {isStringValid} = require('./validation');

describe('isStringValid', ()=>{
    it('should return non-string values',()=>{
        var res = isStringValid(100);
        expect(res).toBe(false);
    });
    it('should reject string with only spaces' ,()=>{
        var res = isStringValid('  ');
        expect(res).toBe(false);
    });
    it('should allow string with non-space character', ()=>{
        var res = isStringValid('Vivek Bansal');
        expect(res).toBe(true);
    })
});