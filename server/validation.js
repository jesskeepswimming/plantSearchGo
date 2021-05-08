

const stages_enum = ['Seed', 'Seedling', 'Fruiting','Flowering',  'Mature'];


function validateID(id) {
    return Number.isInteger(id)
}

function validateNewProfile(body) {

    // if (!verifyUrlImage(body.image)) return false
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

exports.validateID = validateID;
exports.validateNewProfile = validateNewProfile;
exports.validateNewPost = validateNewPost;
