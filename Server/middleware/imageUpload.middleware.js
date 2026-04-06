//dependencies of this middleware....
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');


//configure storage...
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


//Factory function to create different folder on cloude...
const uploadMiddleware = (folderType = 'posts') =>{
    const folderMap = {
        posts:'cultureConnect/posts',
        profiles:'cultureConnect/profiles',
        galleries:'cultureConnect/galleries',
        rooms:'cultureConnect/rooms',
    };

    const folder = folderMap[folderType] || 'cultureConnect/uploads';

    const storage = new CloudinaryStorage({
        cloudinary,
        params:{
            folder: folder,
            allowed_formats:['jpg','png','jpeg','webp']
        }
    });


    const upload = multer({storage});
    return upload.single('image'); 
};








module.exports = {
    uploadPost:uploadMiddleware('posts'),
    uploadProfile:uploadMiddleware('profiles'),
    uploadRoom:uploadMiddleware('rooms'),
    uploadGallery:uploadMiddleware('galleries')
};