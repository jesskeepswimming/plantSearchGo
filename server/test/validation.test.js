const validation = require('../validation');
const sample = require('./sample')


describe('isValidJson', () => {

    test('check plant_id and post_id validation function', ()=> {
        expect(validation.validateID).toBeInstanceOf(Function);

        expect(validation.validateID(0)).toBeTruthy();
        expect(validation.validateID(100)).toBeTruthy();

        expect(validation.validateID('')).toBeFalsy();
        expect(validation.validateID(-1)).toBeFalsy();
        expect(validation.validateID('hello')).toBeFalsy();
        
    });

    test('check new profile body validation function', ()=> {
        expect(validation.validateNewProfile).toBeInstanceOf(Function);

        expect(validation.validateNewProfile(sample.newProfile1)).toBeTruthy();
        expect(validation.validateNewProfile(sample.newProfile2)).toBeTruthy();

        expect(validation.validateNewProfile(sample.newProfileBadUser)).toBeFalsy();
        expect(validation.validateNewProfile(sample.newProfileBadStage)).toBeFalsy();
        expect(validation.validateNewProfile(sample.newProfileBadPlant)).toBeFalsy();

    });

    test('check new post body validation function', ()=> {
        expect(validation.validateNewPost).toBeInstanceOf(Function);

        expect(validation.validateNewPost(sample.newPost1)).toBeTruthy();

        expect(validation.validateNewPost(sample.newPostBadImage)).toBeFalsy();
        expect(validation.validateNewPost(sample.newPostBadStage)).toBeFalsy();
     
    });
    
})

