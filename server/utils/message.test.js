var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', ()=>{
    it('should generate correct object', ()=>{
        var from = 'Vivek'
        var text = 'Hi'
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({from, text});
    })
})