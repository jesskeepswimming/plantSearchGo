const functions = require('./functions');

test('description', ()=> {
    expect(functions.add(2,2)).toBe(4);
});



describe('isValidJson', () => {
    test('description', ()=> {
        expect(functions.isvalidJSO).toBeInstanceOf(Function);
    });

    const testJSON = {
        'body': 3,
    }

    test('description', ()=> {
        expect(functions.isvalidJSON(testJSON)).toBeTruthy();
    });
})

// test('description2', ()=> {
//     expect(functions.add(1,2)).not.toBe(5);
// })