import firebaseRef from "./firebaseRef";
import auth from "./auth";

const database = firebaseRef.getFirebase().database();
const photos = database.ref('photos');

const addPhoto = (image, progress, err, onComplete) => {
    const storageRef = firebaseRef.getFirebase().storage().ref(`photos/${image.name}`);
    const task = storageRef.put(image);
    task.on('state_changed', progress, err, () => {
        var downloadURL = task.snapshot.downloadURL;
        addPhotoDBRecord(image.name, downloadURL, onComplete, err);
    });
};

const addPhotoDBRecord = (imageName, downloadURL, onComplete, err) => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            photos.push().set({
                name: imageName,
                url: downloadURL
            }, function(error) {
                if (error) {
                    err(error);
                } else {
                    onComplete(imageName, downloadURL);
                }
            });
        }
    });
}

const getPhotos = (callback) => {
    photos.once("value", function(snap) {
        callback(snap.val());
    });
}

const deletePhoto = (imageName, imageKey) => {
    const deletePhotoPromise = deletePhotoContent(imageName);
    const deletePhotoRecordPromise = deletePhotoDBRecord(imageKey);

    return new Promise((res, reject) => {
        Promise.all([deletePhotoPromise, deletePhotoRecordPromise]).then((data) => {
            res()
        }).catch((err) => {
            reject(err);
        });
    });

}

const deletePhotoContent = (imageName) => {
    const storageRef = firebaseRef.getFirebase().storage().ref(`photos/${imageName}`);
    return new Promise((res, reject) => {
        storageRef.delete().then(res, reject);
    });
}

const deletePhotoDBRecord = (imageKey) => {
    return new Promise((res, reject) => {
        const photoRef = photos.child(imageKey);

        photoRef.remove((err) => {
            if (err) {
                reject(err)
            } else {
                res();
            }
        })
    });
}

module.exports = {
    addPhoto,
    getPhotos,
    deletePhoto
};
