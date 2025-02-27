import axios from 'axios';
import { toast } from 'react-toastify';

async function uploadToCloudinary(file) {
    console.log("🚀 ~ uploadToCloudinary ~ file:", file)
    if (!file) toast.error("No file provided");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", `${import.meta.env.VITE_CLOUDNAIRY_UPLOAD_PRESET}`);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDNAIRY_KEY}/image/upload`,
            formData
        );
        return {
            URL: response.data.secure_url
        }

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        toast.error("Failed to upload image. Please try again.");
        return {
            error: "Error uploading to Cloudinary:"
        }
    }
}

export default uploadToCloudinary;
