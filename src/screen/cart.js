import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getContract, connectWallet, getTokenContract } from "../util/contract";
import { useActionsCreator } from "../hook/useActionsCreator";
import { fetchGoods } from "../hook/getGoods";
import { useNavigate } from "react-router-dom";
import { parseEther } from "ethers/utils";
import { CONTRACT_ADDRESS, ether } from "../const";

function Cart () {
    const { setGood } = useActionsCreator();
    const goods = useSelector(state => state.good.good)
    const [cart, setCart] = useState([]);
    const [checkOut, setCheckOut] = useState([]);
    const [address, setAddress] = useState('');
    const navigate = useNavigate();
    //console.log(checkOut)
    
    
    
    useEffect(() => {
        
        const initPage = async () => {  
            const { signer } = await connectWallet();
            const contract = getContract(signer);
            const cart = await contract.getCart();
            //const goodlist = await contract.getGoods();
            //console.log(cart[0].goodId);
            //setGood(goodlist);
            //await GetGoods();
            const goods = await fetchGoods();
            //console.log(goods);
            setGood(goods);
            setCart(cart);
            
            
        } 
        initPage();
    } , [address])

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
        //console.log('ID: ', ID, ' Amount: ', amount);
        let sellStatus; 
        if(goods[ID].sellStatus){
            sellStatus = "true"
        } else {
            sellStatus = "false"
        }

        return (<div key={index} className={`flex gap-2 p-2 m-2 ${!goods[ID].sellStatus ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`}>
            
            <div className=" flex gap-2 content-center items-center w-full justify-between">
                <input type="checkbox" onChange={() => checkOutList(ID)}/>
                <section className=" flex gap-2 content-center items-center" onClick={() => navigate(`/good/${ID}`)}>
                    <img src={goods[ID].image} className="w-20 h-20"/>
                </section>

                <div>{goods[ID].name}</div>
                <div>Price: {(goods[ID].price)/ether} SKY Token</div>

                <div>Amount: {amount}</div>
                <button className="border border-black rounded-xl w-fit px-3 py-2" onClick={()=>handleCancel(ID)} >Cancel</button>
            </div>
        </div>)
    })

    const checkOutGoods = async () => {
        //get approve
        const totalPrice = await getCartTotalPrice();

        await getApprove(totalPrice/ether)          

        //check

    }

    const getCartTotalPrice = async() =>{
        // { signer } = await connectWallet();
        //const contract = getContract(signer);
        let totalPrice = 0;
    
        //const cart = await contract.getCart();
        // console.log('in cart')
        // console.log(cart.length)
        // console.log(checkOut.length)
        // console.log('this is check out 0' + checkOut[0])
        for(let i = 0; i < checkOut.length; i++){
            const price = Number(goods[checkOut[i]].price);
            console.log(price)
            //console.log('this is price ' + price)
            const amount = Number(cart[checkOut[i]].amount);
            console.log(amount)
            // console.log('this is amount '+amount)
            // console.log(i)
            // console.log(price, amount)
            totalPrice += (price * amount);
        }

        console.log(totalPrice);
        return totalPrice;
    }

    const getApprove = async(amount) =>{
        const { signer } = await connectWallet();
        const tokenContract = getTokenContract(signer);
        const approveAmount = parseEther(amount.toString());
        //ethers.utils.parseEther((1).toString());
        //const amountInWei = parseEther((amount).toString());
        //console.log(amountInWei)
        //const amountInWei = 1;
        tokenContract.approve(CONTRACT_ADDRESS, approveAmount)
          .then(tx => {
            // Wait for the transaction to be mined
            return tx.wait();
          })
          .then(() => {
            console.log('token approve successful');
            //buygood(amountInWei);
            checkOutPay();
          })
          .catch(error => {
              console.log(error)
          });
    }
    
    const checkOutPay = async () => {
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        contract.cartCheckOut(checkOut)
        .then(tx => {
            // Wait for the transaction to be mined
            return tx.wait();
          })
          .then(() => {
            console.log('check out successful');
            window.location.reload();
            //buygood(amountInWei);
          })
          .catch(error => {
              console.log(error)
          });;
    }

    window.ethereum?.on('accountsChanged', accounts => {
		localStorage.setItem('address', accounts[0]);
		setAddress(accounts?.length < 1 ? '' : accounts[0]);
	});



    return (
        <div className="flex flex-col text-center items-center">
            <h1>Cart</h1>
            <div className="w-1/2">{rederCartList}</div>
            <button className="border border-black rounded-xl w-fit px-3 py-2" onClick={checkOutGoods}>Check out</button>
        </div>
    );
}
export default Cart