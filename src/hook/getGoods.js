import { useActionsCreator } from "./useActionsCreator";
import { getContract, connectWallet } from "../util/contract";
import { useSelector } from "react-redux";

export async function fetchGoods() {
    
    try {
        const { signer } = await connectWallet();
        const contract = getContract(signer);
        const goods = await contract.getGoods(); // Fetch the array of Good structs
        const goodList = goods.map((good, index) => {
            // Map each Good struct to a JavaScript object
            return {
                id: index,
                name: good.name,
                description: good.description,
                price: Number(good.price), 
                owner: good.owner,
                amount: Number(good.amount), 
                comment: good.comment.map(comment => ({
                    name: comment.name,
                    comment: comment.comment,
                    star: Number(comment.star)
                })),
                sellStatus: good.sellStatus,
                image: good.image,
                buyBefore: good.buyBefore,
                categories: good.categories
            };
        });
        
        return goodList; // This is your array of Good objects
    } catch (error) {
        console.error('Error fetching goods:', error);
        return [];
    }
}
