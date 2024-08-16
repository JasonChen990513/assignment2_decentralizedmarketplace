import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { useActionsCreator } from "../hook/useActionsCreator";
import { getContract, connectWallet } from "../util/contract";
import { fetchGoods } from "../hook/getGoods";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categories, ether } from "../const";
import { FaStar } from "react-icons/fa";
import { parseEther } from "ethers";


function Good() {
    const goodId = useLoaderData(); 
    const { setGood } = useActionsCreator();
    const goods = useSelector(state => state.good.good);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const isOwner = (goods[goodId]?.owner)?.toLowerCase() === (address)?.toLowerCase();
    const [update, setUpdate] = useState(false);
    const [addAmount, setAddAmount] = useState(1);
    const [accountBefore, setAccountBefore] = useState(false);


    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const [rating, setRating] = useState(0); // State for selected rating
    const [hover, setHover] = useState(0);   // State for hovered star

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
            await checkBuyBefore();
            if(goods[goodId] !== undefined) {
                setName(goods[goodId].name);
                setDiscription(goods[goodId].description);
                setPrice(((goods[goodId].price)/ether).toString());
                setAmount(goods[goodId].amount);
                setSellStatus(goods[goodId].sellStatus);
                setCategory(goods[goodId].categories);
                setImage(goods[goodId].image);
            }
        } 
        initPage();
    },[address])

    const checkBuyBefore = async () => {
        for(let i = 0; i < goods[goodId]?.buyBefore?.length; i++) {
            if(goods[goodId]?.buyBefore[i]?.toLowerCase() === (address)?.toLowerCase()) {
                setAccountBefore(true);
                return;
            } else{
                setAccountBefore(false);
            }
        }
    }

    const commentList = (comments) => {
        const commmentShow = comments?.map((comment, index) => {
            return (
                <div key={index} className=" text-start m-2">
                    <div className="flex gap-2 my-2">
                        <div>Name: {comment.name}</div>
                        <div>{'⭐'.repeat(comment.star)}</div>
                    </div>
                    <div>{comment.comment}</div>
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

    const submitComment = async () => {
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        contract.addComment(userName, comment, rating, goodId)
            .then(tx => {
                // Wait for the transaction to be mined
                return tx.wait();
            })
            .then(() => {
                alert("add comment successful")
                window.location.reload();
            })
            .catch(error => {
                    console.log(error)
            });
    }

    const itemInfo = () => {
        //console.log(goods[goodId]?.sellStatus);
        if(goods[goodId] !== undefined) {
            return(
                <div className="flex justify-center">
                    <section className="flex flex-col text-center w-2/3">
                        <div className="grid grid-cols-12">
                            <div className="col-span-4">
                                <img src={goods[goodId].image} className={`w-60 h-60 ${goods[goodId].sellStatus ? '' : 'opacity-50'}`} alt={goods[goodId].name}/> 
                            </div>
                            <div className="col-span-8 text-start">
                                <div>Name: {goods[goodId].name}</div>
                                <div>Price: {(goods[goodId].price)/ether} SKY Token</div>
                                <div>Owner Address: {goods[goodId].owner}</div>
                                <div>Sell Status: {goods[goodId].sellStatus ? "available" : "unavailable"}</div>
                                <div>Buy: {goods[goodId].buyBefore}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 ">
                            <div className="col-span-6 text-start">{goods[goodId].description}</div>
                            <div className="col-span-6">
                                <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className=" border border-black rounded-xl p-2 mx-2"/>
                                <button onClick={handleAddCart}  className={`border border-black rounded-xl w-fit px-3 py-2 ${goods[goodId].sellStatus ? 'hover:cursor-pointer' : ' opacity-50 cursor-not-allowed'}`}>Add to Cart</button>
                            </div>
                        </div>   
                        <div>
                            <div className="my-5">Product Reviews</div>
                            <div> {accountBefore && 
                                    <div className=" my-5 ">
                                        <div>Leave a comment: </div>
                                        <div className="flex justify-around my-3">
                                            <input type="text" placeholder="Name" value={userName} onChange={(e) => setUserName(e.target.value)}  className=" border border-black rounded-xl p-2 mx-2"/>
                                            <div className="flex space-x-1">
                                                {[...Array(5)].map((_, index) => {
                                                    const starValue = index + 1;
                                                    return (
                                                    <button
                                                        key={starValue}
                                                        type="button"
                                                        onClick={() => setRating(starValue)} // Set the rating when clicked
                                                        onMouseEnter={() => setHover(starValue)} // Highlight on hover
                                                        onMouseLeave={() => setHover(0)} // Remove highlight when not hovering
                                                        className={`text-2xl ${starValue <= (hover || rating) ? 'text-yellow-500' : 'text-gray-400'}`} // Adjust the size and color of stars
                                                    >
                                                        <FaStar />
                                                    </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <input type="textarea" placeholder="Comment here"  value={comment} onChange={(e) => setComment(e.target.value)}  className=" border border-black rounded-xl p-2 mx-2 h-24 w-2/3"/>
                                        <button onClick={submitComment} className="border border-black rounded-xl w-fit px-3 py-2">Submit</button>
                                    </div>
                                }</div>
                            <div>{rederCommentList}</div>
                        </div>
                    </section>
                </div>

            )
        }
    }
    
    const renderItem = itemInfo();
    
    const handleSubmit = async (e) => {
        console.log('submit')
        e.preventDefault();
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        await contract.updateGood(goodId, name, discription, parseEther(price), amount, sellStatus, category, image)
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
                    <button onClick={(event) => {
                        event.preventDefault();
                        setSellStatus(!sellStatus);
                        }} className="border border-black rounded-xl w-fit px-3 py-2">Sell Status</button>
                </div>
                <label>image</label>
                <input type="text" value={image} onChange={e => setImage(e.target.value)} className=" border border-black rounded-xl p-2"/>
                {image !== '' && 
                    <div>
                        <label>Image preview</label>
                        <img src={image} className="w-20 h-20" alt="preview"/>
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

    window.ethereum?.on('accountsChanged', accounts => {
		localStorage.setItem('address', accounts[0]);
		setAddress(accounts?.length < 1 ? '' : accounts[0]);
	});

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