import { useState } from "react";
import { getContract, connectWallet } from "../util/contract";
import { useNavigate } from 'react-router-dom';
import { categories } from "../const";

function AddGoods() {
    const [name, setName] = useState('');
    const [discription, setDiscription] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    //const categories = ['Food', 'Electronics', 'Books', 'Clothing', 'Toys', 'Furniture', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, discription, price, amount, image, category)
        const { signer } = await connectWallet();
        const contract = await getContract(signer);
        contract.addGood(name, discription, price, amount, image, category)
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
                    <input type="text" value={image} onChange={e => setImage(e.target.value)} className=" border border-black rounded-xl p-2"/>
                    
                    {image !== '' && 
                    <div>
                        <label>Image preview</label>
                        <img src={image} className="w-20 h-20"/>
                    </div>
                    }
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