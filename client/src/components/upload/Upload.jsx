import React, { useRef } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import toast from 'react-hot-toast';

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/upload`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

const Upload = ({ setImg }) => {
    const uploadRef = useRef(null);

    const onError = err => {
        console.log("Error", err);
        setImg(prev => ({ ...prev, error: err }));

        toast.dismiss('uploadToast')
        toast.error('Could not upload image');
    };

    const onSuccess = res => {
        console.log("Success");
        setImg(prev => ({ ...prev, isLoading: false, dbData: res }));

        toast.dismiss('uploadToast')
        toast.success('Image uploaded successfully!');
    };

    const onUploadProgress = progress => {
        const progressPercentage = Math.round((progress.loaded / progress.total) * 100);
        console.log("Progress", progressPercentage);
    };

    const onUploadStart = evt => {
        // Show initial loading toast
        toast.loading('Uploading image...', {
            id: 'uploadToast',
        });

        const file = evt.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImg(prev => ({
                ...prev, isLoading: true, aiData: {
                    inlineData: {
                        data: reader.result.split(",")[1],
                        mimeType: file.type
                    }
                }
            }));

        };
        reader.readAsDataURL(file);
    };

    return (
        <div className='upload'>
            <IKContext
                publicKey={publicKey}
                urlEndpoint={urlEndpoint}
                authenticator={authenticator}
            >
                <IKUpload
                    fileName={null}
                    onError={onError}
                    onSuccess={onSuccess}
                    useUniqueFileName={true}
                    onUploadProgress={onUploadProgress}
                    onUploadStart={onUploadStart}
                    style={{ display: 'none' }}
                    ref={uploadRef}
                />
                <label onClick={() => uploadRef.current.click()}>
                    <img src={"/attachment.png" || null} alt="Upload" />
                </label>
            </IKContext>
        </div>
    );
}

export default Upload;
