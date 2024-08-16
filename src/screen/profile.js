import { useActionsCreator } from "../hook/useActionsCreator";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getContract, connectWallet } from "../util/contract";
import { fetchGoods } from "../hook/getGoods";
import { useNavigate } from "react-router-dom";
import { ether } from "../const";

function Profile() {
    const { setGood } = useActionsCreator();
    const goods = useSelector(state => state.good.good);
    const [address, setAddress] = useState('');

    const navigate = useNavigate();

    window.ethereum?.on('accountsChanged', accounts => {
		localStorage.setItem('address', accounts[0]);
		setAddress(accounts?.length < 1 ? '' : accounts[0]);
	});


    useEffect(() => {
        
        const initPage = async () => {  
            const { signer, account } = await connectWallet();
            const contract = getContract(signer);
            //console.log(cart[0].goodId);
            //setGood(goodlist);
            //await GetGoods();
            const goods = await fetchGoods();
            //console.log(goods);
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
            return <div key={index} className={`flex gap-6 w-2/3 p-2 m-2 items-center justify-center cursor-pointer ${!good.sellStatus ? 'opacity-50' : ''}`} onClick={() => toGoodPage(index)}>
                
                <img src={good.image} className="w-20 h-20"/>
                <div>{good.name}</div>
                <div>Price: {(good.price)/ether} SKY Token</div>
                <div>Remain Amount: {good.amount}</div>
                <div>Category: {good.categories}</div>
            </div>

        }else{
            return;
        }
    })

    return (
        <div className="flex flex-col items-center">   
            <h1>profile</h1>
            {rederOwnGoodsList}
        </div>
    );
}   
export default Profile