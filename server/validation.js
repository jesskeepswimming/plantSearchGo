

const stages_enum = ['Seed', 'Seedling', 'Fruiting','Flowering',  'Mature'];


function validateID(id) {
    return Number.isInteger(id) && id >=0
}

function validateNewProfile(body) {

    if (!body.user_id || !body.plant || !body.image) return false
    if (!stages_enum.includes(body.stage)) return false
    if (typeof body.variety !== 'string' || typeof body.caption !== 'string') return false

    return true
}

// TODO: Make request to image url to check validity of imagetype
function validateNewPost(body) {

    if (!validateID(body.plant_id)) return false
    if (!stages_enum.includes(body.stage)) return false
    if (!body.image) return false
    if (typeof body.caption !== 'string') return false

    return true
}

function parseNewProfile(body) {
    return [body.user_id, body.plant, body.for_sale, body.image, body.variety]
}

function parseNewPost(body, plant_id) {
    return [plant_id, body.stage, body.caption, body.image]
}


exports.validateID = validateID;
exports.validateNewProfile = validateNewProfile;
exports.validateNewPost = validateNewPost;

exports.parseNewProfile = parseNewProfile;
exports.parseNewPost = parseNewPost;
