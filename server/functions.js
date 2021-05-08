const functions = {
    add: (a, b) => a + b,
    // isNull: (s) => s





    isValidJSON = string => {
        try {
            JSON.parse(string);
            return true;
        } catch (error) {
            console.log(error.message)
            return false;
        }
    }

    validateBody = josnBody => {
        
    }


}


module.exports = functions;