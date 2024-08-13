import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getContract, connectWallet } from "../util/contract";
import { useActionsCreator } from "../hook/useActionsCreator";
import { fetchGoods } from "../hook/getGoods";
import { useNavigate } from "react-router-dom";


function Cart () {
    const { setGood } = useActionsCreator();
    const goods = useSelector(state => state.good.good)
    const [cart, setCart] = useState([]);
    const [checkOut, setCheckOut] = useState([]);
    const navigate = useNavigate();
    console.log(checkOut)
    
    
    
    useEffect(() => {
        
        const initPage = async () => {  
            const { signer } = await connectWallet();
            const contract = getContract(signer);
            const cart = await contract.getCart();
            const goodlist = await contract.getGoods();
            //console.log(cart[0].goodId);
            //setGood(goodlist);
            //await GetGoods();
            const goods = await fetchGoods();
            console.log(goods);
            setGood(goods);
            setCart(cart);
            
            
        } 
        initPage();
    } , [])

    // const rederCommentList = cart?.map((comment, index) => {
    //     console.log(comment)
    //     return(
    //         <div>
    //             <div>{comment}</div>
    //         </div>
    //     )
    // })

    const checkOutList = (id) =>{
        if(!checkOut.includes(id)){
            setCheckOut([...checkOut, id]);
        } else {
            setCheckOut(checkOut.filter(item => item !== id));
        }
    }

    const handleCancel = async (id) => {
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        contract.removeFromCart(id)
            .then(tx => {
                // Wait for the transaction to be mined
                return tx.wait();
            })
            .then(async() => {
                console.log('cancel item successful');
                const { signer } = await connectWallet();
                const contract = getContract(signer);
                const cart = await contract.getCart();
                setCart(cart);
            })
            .catch(error => {
                    console.log(error)
            });

    }

    const rederCartList = cart?.map((cartItem, index) => {
        const ID = Number(cartItem.goodId);
        const amount = Number(cartItem.amount);
        let sellStatus; 
        if(goods[ID].sellStatus){
            sellStatus = "true"
        } else {
            sellStatus = "false"
        }

        return (<div key={index} className=" flex gap-2 p-2 m-2 cursor-pointer">
            <div className=" flex gap-2 content-center items-center">
                <input type="checkbox" onChange={() => checkOutList(ID)}/>
                <section className=" flex flex-col gap-2 content-center items-center" onClick={() => navigate(`/good/${ID}`)}>
                    <div>ID: {ID}</div>
                    <div>Amount: {amount}</div>
                    <div>Name: {goods[ID].name}</div>
                    <div>Price: {Number(goods[ID].price)}</div>
                    <img src={goods[ID].image} className="w-20 h-20"/>
                    <div>Category: {goods[ID].categories}</div>
                    <div>{sellStatus}</div>
                </section>
                <button className="border border-black rounded-xl w-fit px-3 py-2" onClick={()=>handleCancel(ID)} >Cancel</button>
            </div>
        </div>)
    })

    const checkOutGoods = async () => {
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        await contract.cartCheckOut(checkOut);
    }
    


    return (
        <div className="flex flex-col text-center items-center">
            <h1>Cart</h1>
            <div>{rederCartList}</div>
            <button className="border border-black rounded-xl w-fit px-3 py-2" onClick={checkOutGoods}>Check out</button>
        </div>
    );
}
export default Cart