import { useState } from "react";
import { getContract, connectWallet } from "../util/contract";
import { useNavigate } from 'react-router-dom';
import { categories } from "../const";
import { ether } from "../const";
import { parseEther } from "ethers";

function AddGoods() {
    const [name, setName] = useState('');
    const [discription, setDiscription] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [preview, setPreview] = useState('');
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    const checkInput = () => {
        if(name === '' || discription === '' || price === '' || amount === '' || image === '' || category === '') {
            alert('please fill in all the information');
            return false;
        } 

        return true;
    }

    function isValidNumber(value) {
        // Check if the value is a number and is finite (not NaN, Infinity, etc.)
        if (typeof value === 'number' && isFinite(value)) {
            return true;
        }
        return false;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!checkInput()) {
            return;
        }
        //console.log(name, discription, price, amount, image, category)
        const { signer } = await connectWallet();
        const contract = await getContract(signer);
        contract.addGood(name, discription, parseEther(price), amount, imageUrl, category)
            .then(tx => {
                // Wait for the transaction to be mined
                return tx.wait();
            })
            .then(() => {
                console.log('add item successful');
                navigate('/homepage');
            })
            .catch(error => {
                    console.log(error)
            });
    }

    
  const handleImageChange = (event) => {
    try {
        const file = event.target.files[0];
        setImage(file);
    
        // Generate image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.log(error);   
    }
  };

  const handleUploadImage = async (event) => {
        event.preventDefault();
        if(name === ''){
            alert('please fill in name to upload image');
            return;
        }
        if (!image) {
            alert('Please select an image to upload');
            return;
        }

        const formData = new FormData();

        //local server
        formData.append('name', name); // direct set the product name here
        formData.append('image', image);
        console.log(image.name) // will include the .jpg
        console.log(image)
        try {
        const response = await fetch('http://localhost:4000/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data)
        console.log(data.imageUrl)
        if (response.ok) {
            setImageUrl(data.imageUrl);  // Set the image URL for display
        } else {
            alert('Image upload failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    };


    return (
        <div className=" flex flex-col justify-center">

            <div className=" text-center">addGoods</div>
            <section className="flex justify-center">
                <form className=" flex flex-col gap-2 w-1/2" onSubmit={handleSubmit}>
                    <label>name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className=" border border-black rounded-xl p-2"/>
                    <label>discription</label>
                    <input type="text" value={discription} onChange={e => setDiscription(e.target.value)} className=" border border-black rounded-xl p-2"/>
                    <label>price</label>
                    <input type="text" value={price} onChange={e => setPrice(e.target.value)} className=" border border-black rounded-xl p-2"/>
                    <label>amount</label>
                    <input type="text" value={amount} onChange={e => setAmount(e.target.value)} className=" border border-black rounded-xl p-2"/>
                    <label>image</label>
                    <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className=" border border-black rounded-xl p-2" placeholder="Can put link here or upload image to get the link"/>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <button onClick={handleUploadImage} className="border border-black rounded-xl w-fit px-3 py-2">Upload Image</button>
                    {/* {imageUrl !== '' && 
                    <div>
                        <label>Image preview</label>
                        <img src={imageUrl}style={{ width: '300px' }}/>
                    </div>
                    } */}
                    { (preview || imageUrl) && (
                        <div>
                            <h3>Uploaded Image:</h3>
                            <img src={ preview || imageUrl } alt="Uploaded" style={{ width: '300px' }} />
                        </div>
                    )}
                    <label>category</label>
                    <select
                        id="category-dropdown"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="block w-full p-2 border border-gray-300 rounded-lg"
                        >
                        <option value="" disabled>Select a category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-center">
                        <button type="submit" className="border border-black rounded-xl w-fit px-3 py-2">Submit</button>
                    </div>  
                </form>
            </section>

        </div>
    );
}
export default AddGoods