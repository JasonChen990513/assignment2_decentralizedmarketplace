import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useActionsCreator } from "../hook/useActionsCreator";
import { getContract, connectWallet } from "../util/contract";
import { fetchGoods } from "../hook/getGoods";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categories } from "../const";

function Good() {
    const goodId = useLoaderData(); 
    const { setGood } = useActionsCreator();
    const goods = useSelector(state => state.good.good);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const isOwner = (goods[goodId]?.owner)?.toLowerCase() === (address)?.toLowerCase();
    const [update, setUpdate] = useState(false);
    const [addAmount, setAddAmount] = useState(1);


    const [name, setName] = useState('');
    const [discription, setDiscription] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [sellStatus, setSellStatus] = useState(false);

    useEffect(() => {
        const initPage = async () => {  
            const { account } = await connectWallet();
            const goods = await fetchGoods();
            setAddress(account);
            setGood(goods);
            if(goods[goodId] !== undefined) {
                setName(goods[goodId].name);
                setDiscription(goods[goodId].description);
                setPrice(goods[goodId].price);
                setAmount(goods[goodId].amount);
                setSellStatus(goods[goodId].sellStatus);
                setCategory(goods[goodId].categories);
                setImage(goods[goodId].image);
            }
        } 
        initPage();
    },[])


    const commentList = (comments) => {
        const commmentShow = comments?.map((comment, index) => {
            return (
                <div key={index}>
                    <div>Name: {comment.name}</div>
                    <div>{comment.comment}</div>
                    <div>Star: {comment.star}</div>
                </div>
            )
        })

        return commmentShow;
    }

    const comments = goods[goodId]?.comment;
    const rederCommentList = commentList(comments);

    const handleAddCart = async () => {
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        contract.addToCart(goodId, addAmount)
            .then(tx => {
                // Wait for the transaction to be mined
                return tx.wait();
            })
            .then(() => {
                console.log('add item successful');
                alert("add item successful")
            })
            .catch(error => {
                    console.log(error)
            });

    }

    const itemInfo = () => {
        if(goods[goodId] !== undefined) {
            return(
                <section className=" text-center">   
                    <div>Name: {goods[goodId].name}</div>
                    <div>Description: {goods[goodId].description}</div>
                    <div>Price: {goods[goodId].price}</div>
                    <div>Owner: {goods[goodId].owner}</div>
                    <div>Amount: {goods[goodId].amount}</div>
                    <div>Sell Status: {goods[goodId].sellStatus ? "available" : "unavailable"}</div>
                    <img src={goods[goodId].image} className="w-20 h-20"/>
                    <div>Categories: {goods[goodId].categories}</div>
                    <div>{goods[goodId].buyBefore}</div>
                    <div className="">
                        <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className=" border border-black rounded-xl p-2 mx-2"/>
                        <button onClick={handleAddCart}  className="border border-black rounded-xl w-fit px-3 py-2">Add to Cart</button>
                    </div>
                    
                    <div>{rederCommentList}</div>
                </section>
            )
        }
    }
    
    const renderItem = itemInfo();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        await contract.updateGood(goodId, name, discription, price, amount, sellStatus, category, image)
        .then(tx => {
            // Wait for the transaction to be mined
            return tx.wait();
        })
        .then(() => {
            console.log('modify item successful');
            navigate('/profile');
        })
        .catch(error => {
                console.log(error)
        });

        console.log('update')
    }

    const updateGoods = () => {

        return(
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
                <div>
                    <div>Sell Status: {sellStatus ? "available" : "unavailable"}</div>
                    <button onClick={() => setSellStatus(!sellStatus)} className="border border-black rounded-xl w-fit px-3 py-2">Sell Status</button>
                </div>
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
        )
    }

    const renderUpdate = updateGoods();



    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-center">Good</h1>
            <div className="text-center">{isOwner && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setUpdate(!update)}>{update ? 'Cancel' : 'Update' }</button>}</div>
            {!update && renderItem}
            {update && renderUpdate}
        </div>
    );
}
export default Good