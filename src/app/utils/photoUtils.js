import firebaseRef from "./firebaseRef";
import auth from "./auth";

const database = firebaseRef.getFirebase().database();
const photos = database.ref('photos');

/**
 *
 * @param image
 * @param progress - calls with a percent of the image uploaded from 0-100
 * @param err
 * @param onComplete
 */
const addPhoto = (image, progress, err, onComplete) => {
    const storageRef = firebaseRef.getFirebase().storage().ref(`photos/${image.name}`);
    const task = storageRef.put(image);

    const percentProgress = (snapshot) => {
        const percentUploaded = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        if (progress) {
            progress(percentUploaded);
        }
    };

    task.on('state_changed', percentProgress, err, () => {
        var downloadURL = task.snapshot.downloadURL;
        addPhotoDBRecord(image.name, downloadURL, onComplete, err);
    });
};

const addPhotoDBRecord = (imageName, downloadURL, onComplete, err) => {
    const uploadDate = new Date().toJSON();

    auth.onAuthStateChanged((user) => {
        if (user) {
            photos.push().set({
                name: imageName,
                url: downloadURL,
                uploadDate 
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
