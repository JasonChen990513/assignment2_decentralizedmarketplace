import { ethers } from "ethers";
import { CONTRACT_ADDRESS, TOKEN_ADDRESS } from "../const";
import { contractAbi, tokenAbi, testAbi } from "./abi";
console.log()
const abi = contractAbi;
const TokenAbi = tokenAbi;

export const connectProvider = () =>{
    const provider = new ethers.BrowserProvider(window.ethereum);
    return{provider}
}

export const connectWallet = async() =>{
    //let provider = null;
    // let signer = null;
    let account = '';
    //6.13.1
    const provider = new ethers.BrowserProvider(window.ethereum)
    //console.log(provider)
    //5.7
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //console.log(accounts)
    account = accounts?.length > 0 ? accounts[0] : '';
    const signer = await provider?.getSigner();
    //console.log(signer)

    // const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // const account = accounts[0];

    return{account, signer ,provider}
}


export const getContract = (signer) =>{
    return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
}

export const readOnlyContract = (provider) =>{
    return new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
}


export const getTokenContract = (signer) =>{
    return new ethers.Contract(TOKEN_ADDRESS, TokenAbi, signer);
}

export const getTestContract = (signer) =>{
    return new ethers.Contract('0x0d237bb680a9f22208091e6B74847A537E209bf7', testAbi, signer);
}