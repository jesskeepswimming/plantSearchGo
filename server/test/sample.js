exports.profile = ["userA", "Tree", true, "https://i.redd.it/1rjgjr6dytx61.jpg", "Money Tree"]

exports.post = [1, "Seedling", "a caption", "https://i.redd.it/1rjgjr6dytx61.jpg"]

exports.update = ["https://www.gardeningknowhow.com/wp-content/uploads/2011/02/tomatoes-picture.jpg", 1]

exports.newProfile1 =  {
    "user_id": "jesslui1008@gmail.com",
    "plant": "Tomato",
    "for_sale": false,
    "image": "https://i.redd.it/jqqqvqumz20z.jpg",
    "variety": "Heirloom",
    "stage": "Seedling",
    "caption": "this is a caption"
}

exports.newProfile2 =  {
    "user_id": "Anonymous",
    "plant": "Unknown Plant",
    "for_sale": false,
    "image": "https://i.redd.it/jqqqvqumz20z.jpg",
    "variety": "",
    "stage": "Mature",
    "caption": ""
}

exports.newProfileBadUser =  {
    "user_id": "",
    "plant": "Tomato",
    "for_sale": false,
    "image": "https://i.redd.it/jqqqvqumz20z.jpg",
    "variety": "Heirloom",
    "stage": "Seedling",
    "caption": "this is a caption"
}

exports.newProfileBadStage =  {
    "user_id": "jesslui1008@gmail.com",
    "plant": "Tomato",
    "for_sale": false,
    "image": "https://i.redd.it/jqqqvqumz20z.jpg",
    "variety": "Heirloom",
    "stage": "Invalid Enum",
    "caption": "this is a caption"
}

exports.newProfileBadPlant =  {
    "user_id": "jesslui1008@gmail.com",
    "plant": "",
    "for_sale": false,
    "image": "https://i.redd.it/jqqqvqumz20z.jpg",
    "variety": "Heirloom",
    "stage": "Invalid Enum",
    "caption": "this is a caption"
}


exports.newPost1 = {
    "plant_id": 6,
    "stage": "Flowering", 
    "caption": "this is another caption", 
    "image": "https://www.gardeningknowhow.com/wp-content/uploads/2011/02/tomatoes-picture.jpg"
}

exports.newPostBadImage = {
    "plant_id": 6,
    "stage": "Flowering", 
    "caption": "this is another caption", 
    "image": ""
}

exports.newPostBadStage = {
    "plant_id": 6,
    "stage": "Floweridng", 
    "caption": "this is another caption", 
    "image": ""
}