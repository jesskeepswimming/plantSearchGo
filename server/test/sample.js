// post("/user/new")
exports.user1 = {
    "email": "jesslui1008@gmail.com",
    "username": "jesskeepswimming"
}
exports.user2 = {
    "email": "jessicalui@uwblueprint.org",
    "username": "jesslui"
}

// post("/identify") venus flytrap, squash
exports.identification1 = { 
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/plants-2a2d0.appspot.com/o/images%2F1620620896201venus-flytrap.jpg?alt=media&token=17dd43f8-836a-4795-a8ca-9ff99036e0d8",
    "latitude": 43.472286,
    "longitude": -80.544861
}
exports.identification2 = { 
    "imageUrl": "https://firebasestorage.googleapis.com/v0/b/plants-2a2d0.appspot.com/o/images%2F1620444808045IMG_3586.jpg?alt=media&token=3560bfe5-98ef-4b1a-bac8-22be3e16112e",
    "latitude": 43.462650,
    "longitude": -80.538930
}

// app.post("/pin/upload)
exports.newPlantPin1 = {
    "plant_name": "Dionaea muscipula",
    "common_name":"Venus flytrap",
    "plant_details": {
       "notes":"Found on edge of park"
    },
    "user": "jesslui1008@gmail.com",
    "image": "https://firebasestorage.googleapis.com/v0/b/plants-2a2d0.appspot.com/o/images%2F1620620896201venus-flytrap.jpg?alt=media&token=17dd43f8-836a-4795-a8ca-9ff99036e0d8",
    "latitude": 43.472286,
    "longitude": -80.544861
}
exports.newPlantPin2 = {
    "plant_name": "Cucurbita pepo",
    "common_name": "Field pumpkin",
    "plant_details": {
        "notes": "This plant is doing well"
    },
    "user": "jesslui1008@gmail.com",
    "image": "https://firebasestorage.googleapis.com/v0/b/plants-2a2d0.appspot.com/o/images%2F1620444808045IMG_3586.jpg?alt=media&token=3560bfe5-98ef-4b1a-bac8-22be3e16112e",
    "latitude": 43.462650,
    "longitude": -80.538930
}

//app.post("/plants/upload")
exports.newPlant = {
    "plant_name": "Dionaea muscipula",
    "common_name" : "Venus flytrap",
    "plant_details": {
        "notes": "i am happy",
        "wiki_description": {
            "value": "The Venus flytrap (Dionaea muscipula) is a carnivorous plant native to subtropical wetlands on the East Coast of the United States in North Carolina and South Carolina. It catches its prey—chiefly insects and arachnids—with a trapping structure formed by the terminal portion of each of the plant's leaves, which is triggered by tiny hairs (called \"trigger hairs\" or \"sensitive hairs\") on their inner surfaces.\nWhen an insect or spider crawling along the leaves contacts a hair, the trap prepares to close, snapping shut only if another contact occurs within approximately twenty seconds of the first strike. Triggers may occur if one-tenth of the insect is within contact. The requirement of redundant triggering in this mechanism serves as a safeguard against wasting energy by trapping objects with no nutritional value, and the plant will only begin digestion after five more stimuli to ensure it has caught a live bug worthy of consumption.\nDionaea is a monotypic genus closely related to the waterwheel plant (Aldrovanda vesiculosa) and sundews (Drosera), all of which belong to the family Droseraceae.\nAlthough widely cultivated for sale, the population of the Venus flytrap has been rapidly declining in its native range. The species is currently under Endangered Species Act review by the U.S. Fish & Wildlife Service.",
            "citation": "https://en.wikipedia.org/wiki/Dionaea_muscipula",
            "license_name": "CC BY-SA 3.0",
            "license_url": "https://creativecommons.org/licenses/by-sa/3.0/"
        }
    },
    "user": "jessicalui@uwblueprint.org",
    "image": "https://firebasestorage.googleapis.com/v0/b/plants-2a2d0.appspot.com/o/images%2F1620620896201venus-flytrap.jpg?alt=media&token=17dd43f8-836a-4795-a8ca-9ff99036e0d8",
    "pin_id": 3
}

// app.get("/pins/0/vicinity/3000")
//  app.get("/pin/0/plants")
// app.delete("/plants/2")