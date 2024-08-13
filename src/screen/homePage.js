import { useEffect } from "react";
import { useActionsCreator } from "../hook/useActionsCreator";
import { getContract, connectWallet, getTestContract } from "../util/contract";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchGoods } from "../hook/getGoods";

function HomePage() {   
    const { setGood, search, filter } = useActionsCreator();
    const goods = useSelector(state => state.good.good);
    const navigate = useNavigate();

    const commentList = (comments) => {
        const commmentShow = comments.map((comment, index) => {
            return (
                <div key={index}>
                    <div>{comment.name}</div>
                    <div>{comment.comment}</div>
                    <div>{comment.star}</div>
                </div>
            )
        })

        return commmentShow;
    }

    const toGoodPage = (goodId) => {
        navigate(`/good/${goodId}`);
    } 


    const rederGoodList = goods?.map((good, index) => {
        const comments = good.comment;
        const rederCommentList = commentList(comments);


        return <div key={index} className=" flex gap-2 p-2 m-2 hover:cursor-pointer" onClick={() => toGoodPage(index)}>
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
    })


    useEffect(() => {

        const initPage = async () => {  
            // const { signer } = await connectWallet();
            // const contract = getContract(signer);
            // const goodlist = await contract.getGoods();
            // console.log(goodlist);
            const goods = await fetchGoods();

            // const testcontract = getTestContract(signer);
            // const testgoodlist = await testcontract.artworkCount();
            // console.log(testcontract)
            // console.log("here is the test value " + testgoodlist);

            setGood(goods);
        } 
        initPage();
    }, [])

    return (
        <div>
            <h1>homePage</h1>
            <div>{rederGoodList}</div>
            <button></button>
        </div>
    );
}
export default HomePage