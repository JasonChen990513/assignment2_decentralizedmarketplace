import { connectWallet, getContract, connectProvider, readOnlyContract, getTokenContract, getNFTContract } from './util/contract';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CONTRACT_ADDRESS } from "./const";
import { parseEther, parseUnits } from "ethers/utils";
import { FaStar } from "react-icons/fa";
import { PinataSDK  } from 'pinata';
import axios from 'axios';


const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxYjJlZjE1ZS01NzZiLTQ3YzAtOWJhYi0yNDA5Y2E5NjMzN2YiLCJlbWFpbCI6Imp5MTQ5MTM2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiNTE5ZWJlZGYzNGQwYzM2MmIxZiIsInNjb3BlZEtleVNlY3JldCI6ImI3NmFiZjRkNWVjNjNmMDU0ZDdjY2Q1N2UwOTczMWI0MzcwNmEzNWRkMGIwNzM5ZWZkODA2ZWM3NTRkZTBlNGMiLCJleHAiOjE3NTY1NDY5NTh9.w-AisOwTtIrtDemmlHlUzKbujtyjApLVlRdem2uOtfM",
  pinataGateway: "pink-bitter-tarsier-946.mypinata.cloud",
});

const pinataJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxYjJlZjE1ZS01NzZiLTQ3YzAtOWJhYi0yNDA5Y2E5NjMzN2YiLCJlbWFpbCI6Imp5MTQ5MTM2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiNTE5ZWJlZGYzNGQwYzM2MmIxZiIsInNjb3BlZEtleVNlY3JldCI6ImI3NmFiZjRkNWVjNjNmMDU0ZDdjY2Q1N2UwOTczMWI0MzcwNmEzNWRkMGIwNzM5ZWZkODA2ZWM3NTRkZTBlNGMiLCJleHAiOjE3NTY1NDY5NTh9.w-AisOwTtIrtDemmlHlUzKbujtyjApLVlRdem2uOtfM";
const  pinataGateway = "pink-bitter-tarsier-946.mypinata.cloud";

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

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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


  // const setTestData = async() =>{
  //   const { signer } = await connectWallet();
  //   const contract = getContract(signer);

  //   contract.setTestData()
  //     .then(() => {
  //       console.log('test data set successfully!');
  //       setReflash(!reflash);
  //     })
  //     .catch((error) => console.log(error));
  // }

  // const getCartTotalPrice = async() =>{
  //   const { signer } = await connectWallet();
  //   const contract = getContract(signer);
  //   let totalPrice = 0;

  //   const cart = await contract.getCart();
  //   console.log(cart)
  //   for (let i = 0; i < cart.length; i++) {
  //     const price = Number(goodList[cart[i].goodId].price);
  //     const amount = Number(cart[i].amount);
  //     totalPrice += (price * amount);
  //   }
  //   console.log(totalPrice);
  // }

  // const getApprove = async() =>{
  //   const { signer } = await connectWallet();
  //   const tokenContract = getTokenContract(signer);

  //   //ethers.utils.parseEther((1).toString());
  //   const amountInWei = parseEther((1).toString());
  //   console.log(amountInWei)
  //   //const amountInWei = 1;
  //   tokenContract.approve(CONTRACT_ADDRESS, amountInWei)
  //     .then(tx => {
  //       // Wait for the transaction to be mined
  //       return tx.wait();
  //     })
  //     .then(() => {
  //       console.log('token approve successful');
  //       //buygood(amountInWei);
  //     })
  //     .catch(error => {
  //         console.log(error)
  //     });
  // }


  // const buygood = async() =>{
  //   const amountInWei = parseEther((1).toString());
  //   const { signer } = await connectWallet();
  //   const contract = getContract(signer);

  //   // call buy function
  //   contract.buyGood(0, amountInWei)
  //   .then(tx => {
  //     // Wait for the transaction to be mined
  //     return tx.wait();
  //   })
  //   .then(() => {
  //       // call buy function
  //       alert('test buy successful');
  //   })
  //   .catch(error => {
  //       console.log(error)
  //   });
  // }

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    
    setImage(file);
    // Generate image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!image) {
        alert('Please select an image to upload');
        return;
    }

    const formData = new FormData();
    formData.append('file', image);
    formData.append('pinataOptions','{"cidVersion": 1}');
    //formData.append('pinataMetadata','{"name":"Space3"}');
    const metadate = JSON.stringify({
        name: name,
        keyvalues: {
            decription: `This is the ${name} image`
        }
    })
    formData.append('pinataMetadata',metadate);

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'Authorization': `Bearer ${pinataJwt}`
        }
    })
    console.log(res)
    localStorage.setItem('image_cid', res.data.IpfsHash)
    console.log(res.data.IpfsHash)

    console.log('Upload image success!')
  
    uploadJsonFile(res.data.IpfsHash);
    //pinata
    // formData.append('file', image);
    // try {
    //   const file = new File(["hello"], "Testing.txt", { type: "text/plain" });
    //   const upload = await pinata.upload.file(file);
    //   console.log(upload);
    // } catch (error) {
    //   console.log(error);
    // }
    //imgur server
    //formData.append('image', image);
    // formData.append('title', 'test space');
    // formData.append('description', 'test description');
    // formData.append('type', 'image');
    //Bearer f9c9a5f2352f55a71ff5f81ffe4d314eaf058f93
    // try {
    //   console.log(1)
    //     const response = await fetch('https://api.imgur.com/3/image', {
    //       method: 'POST',
    //       headers: {
    //         "Authorization": 'Client-ID 2111d7697ddfe8b',
    //       },
    //       body: formData
    //     });
    //     console.log(2)
    //     const data = await response.json();
    //     console.log(data)
    //     //console.log(data.imageUrl)
    //     if (response.ok) {
    //         setImageUrl(data.imageUrl);  // Set the image URL for display 
    //     } else {
    //         alert('Image upload failed');
    //     }
    // } catch (error) {
    //     console.error('Error:', error);
    // }


    //local server
    // formData.append('name', image.name); // direct set the product name here
    // formData.append('image', image);
    // console.log(image.name) // will include the .jpg
    // console.log(image)
    // try {
    //   const response = await fetch('http://localhost:4000/upload', {
    //       method: 'POST',
    //       body: formData
    //   });

    //   const data = await response.json();
    //   console.log(data)
    //   console.log(data.imageUrl)
    //   if (response.ok) {
    //       setImageUrl(data.imageUrl);  // Set the image URL for display
    //   } else {
    //       alert('Image upload failed');
    //   }
    //   } catch (error) {
    //       console.error('Error:', error);
    //   }


  };

  const uploadJsonFile = async(imageHash) =>{
    console.log('starting upload json file')

    const formDataJson = new FormData();
   
    const metadate = JSON.stringify({
        name: name,
        keyvalues: {
            decription: description,
        }
    })
    
    const jsonFile = new Blob([JSON.stringify({
      name: name,
      description: description,
      image: `https://pink-bitter-tarsier-946.mypinata.cloud/ipfs/${imageHash}`
  })], { type: 'application/json' });

    formDataJson.append('file', jsonFile, `${name}.json`);
    formDataJson.append('pinataOptions','{"cidVersion": 1}');
    formDataJson.append('pinataMetadata', metadate);
    console.log('form data setup finish')

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formDataJson, {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formDataJson._boundary}`,
            'Authorization': `Bearer ${pinataJwt}`
        }
      })
      alert('Upload json file success!')
      console.log(res)
      localStorage.setItem('json_cid', res.data.IpfsHash)
      console.log(res.data.IpfsHash)

      createNFT(res.data.IpfsHash);
    } catch (error) {
      console.log(error)
    }
  }

  const createNFT = async(json_cid) =>{
    const { signer } = await connectWallet();
    const contract = getNFTContract(signer);

    try {
      console.log('call contract mintNFT')
      await contract.mintNFT(address, `https://pink-bitter-tarsier-946.mypinata.cloud/ipfs/${json_cid}`)
      console.log('Success')
    } catch (error) {
      console.error('Error:', error);
    }
    
  }



  const hendleunPin = async() =>{
    const options = {method: 'DELETE', headers: {Authorization: `Bearer ${pinataJwt}`}};
    fetch(`https://api.pinata.cloud/pinning/unpin/${localStorage.getItem('cid')}`, options)
      .then(response => {
        console.log(response);
        localStorage.removeItem('cid');
        alert('unpin success!')
      })
      .catch(err => console.error(err));
  }

  const [rating, setRating] = useState(0); // State for selected rating
  const [hover, setHover] = useState(0);   // State for hovered star





  return (
    <div className=' flex flex-col gap-2 content-center'>
      <div>APP</div>
        {/* <button onClick={setTestData}>setTestData</button>
        <button onClick={getApprove}>test approve</button>
        <button onClick={buygood}>testbuy</button>
        <button onClick={getCartTotalPrice}>get cart price</button> */}
        <div className="flex flex-col space-x-1 gap-3">
          {/* {[...Array(5)].map((_, index) => {
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
          })} */}
          <div>
            <div>name</div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='border border-black rounded-xl p-2' />
          </div>
          <div>
            <div>description</div>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className='border border-black rounded-xl p-2' />
          </div>
          <div>
              <form onSubmit={handleSubmit}>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <button type="submit" className="border border-black rounded-xl w-fit px-3 py-2"  >Upload Image</button>
              </form>
              {imageUrl && (
                  <div>
                      <h3>Uploaded Image:</h3>
                      <img src={ imageUrl} alt="Uploaded" style={{ width: '300px' }} />
                  </div>
              )}
          </div>
        <div>
          <button onClick={hendleunPin} className='ml-10 border border-black rounded-xl w-fit px-3 py-2'>Unpin</button>
        </div>
      </div>
    
    </div>
  );
}

export default App;
