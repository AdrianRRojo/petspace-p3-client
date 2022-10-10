import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {Image} from 'cloudinary-react'
export default function NewPost({ currentUser, setCurrentUser }){
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [fileInputState, setFileInputState] = useState('')
    const [selectedFile, setSelectedFile] = useState('')
    const [previewSource, setPreviewSource] = useState('')

    const navigate = useNavigate()


   
    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        previewFile(file);
        setSelectedFile(file)
    }


    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); //Converts the file to a url
        reader.onloadend = () => { //Once the reader is done loading
            setPreviewSource(reader.result);

        }
    }
    const [imageIds, setImagesIds] = useState();
    const loadImages = async() => {
        try{
            const res =await fetch(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts/api/images`)
            const data = await res.json()
            setImagesIds(data)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        loadImages()
    }, [])
    // console.log(previewSource, "PREVIEW SOURCE")
    // console.log(selectedFile, "SELECTED FILE")
    const uploadImage = async (base64EncodedImage) => {
       
        try {
            // const stringifyImage = JSON.stringif({data: base64EncodedImage})
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`, 
        {content, 
            userId : currentUser.id, 
            body: base64EncodedImage,
            headers: {'Content-Type': 'application/json'}, })
        
        } catch (err) {
            console.error(err);
        }
    
    }
    
    const handleCreate = async (e) => {
		e.preventDefault()
        if(!previewSource) return;
        uploadImage(previewSource);
		// try{
		// 	const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`, {content, userId : currentUser.id})
		// 	setPosts([...posts, response.data])
		// 	setContent("")
        //     navigate('/posts')
		// }catch(err){
		// 	setErrorMessage(err.message)
		// }
        
	}
    
        // try {
        //     await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`, {
        //         data: base64EncodedImage,
        //         userId : currentUser.id
        //     });
        //     navigate('/posts')
        // } catch (err) {
        //     console.error(err);
        // }

    console.log("NEW POST",currentUser)
    return(
        <div>
            <h1>New Post</h1>
            {imageIds && imageIds.map((imageId, idx) => (
                <Image
                    key = {idx}
                    cloudName ="sdfie0"
                    publicId = {imageId}
                    width = '300'
                    crop = 'scale'
                />
            ))}

            <form>   
                <label htmlFor="content">Content</label>
                <input type="text" name="content" id="content" value={content} onChange={(e) => setContent(e.target.value)}/>

                <label htmlFor="file">File</label>
                <input type = "file" name = "image" id = "image" onChange={handleFileInputChange} value={fileInputState}/>
               
                <button type="submit" onClick={handleCreate}>Submit</button>
            </form>
            {previewSource && ( //If previewSource is true, then show the image
                <img src={previewSource} alt="User uploaded image" 
                style={{height: '300px'}}/>
            )}

        </div>
    )
}