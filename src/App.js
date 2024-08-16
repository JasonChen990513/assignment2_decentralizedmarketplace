import { connectWallet, getContract, connectProvider, readOnlyContract, getTokenContract } from './util/contract';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CONTRACT_ADDRESS } from "./const";
import { parseEther, parseUnits } from "ethers/utils";
import { FaStar } from "react-icons/fa";

const accountAtom = atomWithStorage('walletAddress','');
const contractAtom = atomWithStorage('contractInstance','');
const tokenContractAtom = atomWithStorage('tokenContractInstance', '');
//const readContractAtom = atomWithStorage('readContractInstance','');
function App() {
  const [address, setAddress] = useAtom(accountAtom);
  const [contract, setContract] = useAtom(contractAtom);
  const [tokenContract, seTtokenContract] = useAtom(tokenContractAtom);
  const [goodList, setGoodList] = useState([]);
  const [reflash, setReflash] = useState(false);

  useEffect(() => {
    const ConnectWellet = async() =>{
      let writeContract, tokenContract;
      try {
        const {account, signer, provider} = await connectWallet();
        //console.log(signer);
        writeContract = getContract(signer);
        //console.log(writeContract);
        tokenContract = getTokenContract(signer);
        //console.log(tokenContract);
        setAddress(account);
        setContract(writeContract);
        seTtokenContract(tokenContract);
      } catch (error) {
        console.log(error);
      }

      let goodList ;
      try {
        goodList = await writeContract.getGoods();
      } catch (error) {
        console.log(error);
      }
      setGoodList(goodList)
      //console.log(goodList)

    }

    ConnectWellet();
  }, [reflash]);


  const setTestData = async() =>{
    const { signer } = await connectWallet();
    const contract = getContract(signer);

    contract.setTestData()
      .then(() => {
        console.log('test data set successfully!');
        setReflash(!reflash);
      })
      .catch((error) => console.log(error));
  }

  const getCartTotalPrice = async() =>{
    const { signer } = await connectWallet();
    const contract = getContract(signer);
    let totalPrice = 0;

    const cart = await contract.getCart();
    console.log(cart)
    for (let i = 0; i < cart.length; i++) {
      const price = Number(goodList[cart[i].goodId].price);
      const amount = Number(cart[i].amount);
      totalPrice += (price * amount);
    }
    console.log(totalPrice);
  }

  const getApprove = async() =>{
    const { signer } = await connectWallet();
    const tokenContract = getTokenContract(signer);

    //ethers.utils.parseEther((1).toString());
    const amountInWei = parseEther((1).toString());
    console.log(amountInWei)
    //const amountInWei = 1;
    tokenContract.approve(CONTRACT_ADDRESS, amountInWei)
      .then(tx => {
        // Wait for the transaction to be mined
        return tx.wait();
      })
      .then(() => {
        console.log('token approve successful');
        //buygood(amountInWei);
      })
      .catch(error => {
          console.log(error)
      });
  }

  const buygood = async() =>{
    const amountInWei = parseEther((1).toString());
    const { signer } = await connectWallet();
    const contract = getContract(signer);

    // call buy function
    contract.buyGood(0, amountInWei)
    .then(tx => {
      // Wait for the transaction to be mined
      return tx.wait();
    })
    .then(() => {
        // call buy function
        alert('test buy successful');
    })
    .catch(error => {
        console.log(error)
    });
  }

  const [rating, setRating] = useState(0); // State for selected rating
  const [hover, setHover] = useState(0);   // State for hovered star
  return (
    <div className=' flex flex-col gap-2 content-center'>
      <div>APP</div>
      <button onClick={setTestData}>setTestData</button>
      <button onClick={getApprove}>test approve</button>
      <button onClick={buygood}>testbuy</button>
      <button onClick={getCartTotalPrice}>get cart price</button>
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
  );
}

export default App;
