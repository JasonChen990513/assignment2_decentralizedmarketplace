import { useActionsCreator } from "../hook/useActionsCreator";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getContract, connectWallet } from "../util/contract";
import { fetchGoods } from "../hook/getGoods";
import { useNavigate } from "react-router-dom";

function Profile() {
    const { setGood } = useActionsCreator();
    const goods = useSelector(state => state.good.good);
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        
        const initPage = async () => {  
            const { signer, account } = await connectWallet();
            const contract = getContract(signer);
            //console.log(cart[0].goodId);
            //setGood(goodlist);
            //await GetGoods();
            const goods = await fetchGoods();
            console.log(goods);
            setAddress(account);
            setGood(goods);

            
            
        } 
        initPage();
    } , [])

    const toGoodPage = (goodId) => {
        navigate(`/good/${goodId}`);
    } 


    const rederOwnGoodsList = goods?.map((good, index) => {
        if((good.owner).toLowerCase() === (address).toLowerCase()){
            return <div key={index} className=" flex gap-2 p-2 m-2 cursor-pointer" onClick={() => toGoodPage(index)}>
                <div>{good.name}</div>
                <div>{good.description}</div>
                <div>{good.price}</div>
                <div>{good.owner}</div>
                <div>{good.amount}</div>
                <div>{good.sellStatus}</div>
                <img src={good.image} className="w-20 h-20"/>
                <div>{good.categories}</div>
                <div>{good.buyBefore}</div>
            </div>

        }else{
            return;
        }
    })

    return (
        <div>   
            <h1>profile</h1>
            {rederOwnGoodsList}
        </div>
    );
}   
export default Profile