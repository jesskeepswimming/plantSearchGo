function parseNewUser(body) {
    return [body.email, body.username]
}

function parseNewPlantPin(body) {
    return [body.plant_name, body.common_name, body.plant_details, body.user, body.image, body.latitude, body.longitude]
}

function parseNewPlant(body) {

    return [body.plant_name, body.common_name, body.plant_details, body.user, body.image, body.pin_id]
}

function parseImageRequest(body) {
    return [body.imageUrl, body.latitude, body.longitude]
}

exports.parseNewUser = parseNewUser;
exports.parseNewPlant = parseNewPlant;
exports.parseNewPlantPin = parseNewPlantPin;
exports.parseImageRequest = parseImageRequest;
