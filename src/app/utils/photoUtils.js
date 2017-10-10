import firebaseRef from "./firebaseRef";

const database = firebaseRef.getFirebase().database();
const photos = database.ref('photos');

const addPhoto = (image, onProgress) => {
    return new Promise((resolve, reject) => {
        const storageRef = firebaseRef.getFirebase().storage().ref(`photos/${image.name}`);
        storageRef.getDownloadURL()
            .then(() => {
                reject(`A file with the name ${image.name} already exists.`)
            })
            .catch(() => {
                const uploadTask = storageRef.put(image);

                const onUploadTaskProgress = (snapshot) => {
                    const percentUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) {
                        onProgress(percentUploaded);
                    }
                };

                const onUploadTaskComplete = () => {
                    const downloadURL = uploadTask.snapshot.downloadURL;
                    addPhotoDBRecord(image.name, downloadURL).then(resolve).catch(reject);
                };

                uploadTask.on(`state_changed`, onUploadTaskProgress, reject, onUploadTaskComplete);
            });
    });
};

//firebase paths can't contain ".", "#", "$", "[", or "]"
const getKeyForPhotoName = (photoName) => {
    return photoName.replace(/[.#$[\]]/g, '');
};

const addPhotoDBRecord = (name, url) => {
    return new Promise((resolve, reject) => {
        const uploadDate = new Date().toJSON();
        const photoKey = getKeyForPhotoName(name);

        const addRecordResult = (error) => {
            if (error) {
                reject(error);
            } else {
                resolve({name, url});
            }
        };

        photos.child(photoKey).set({name, url, uploadDate}, addRecordResult);
    });
};


const getPhotos = (callback) => {
    photos.once("value", function (snap) {
        callback(snap.val());
    }).catch(callback);
};

const deletePhoto = (imageName, imageKey) => {
    const deletePhotoPromise = deletePhotoContent(imageName);
    const deletePhotoRecordPromise = deletePhotoDBRecord(imageKey);

    return new Promise((res, reject) => {
        Promise.all([deletePhotoPromise, deletePhotoRecordPromise]).then(() => {
            res()
        }).catch((err) => {
            reject(err);
        });
    });

};

const deletePhotoContent = (imageName) => {
    const storageRef = firebaseRef.getFirebase().storage().ref(`photos/${imageName}`);
    return new Promise((res, reject) => {
        storageRef.delete().then(res, reject);
    });
};

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
};

export default {
    addPhoto,
    getPhotos,
    deletePhoto,
    getKeyForPhotoName
};
