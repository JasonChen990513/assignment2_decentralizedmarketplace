import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchGoods } from "../hook/getGoods";
import HomeCard from "../component/homePageCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useActionsCreator } from "../hook/useActionsCreator";




function CategoriesResult() {
    const keyword = useLoaderData(); 
    const { setGood, filter } = useActionsCreator();
    const filteredGood = useSelector(state => state.good.filteredGood);
    const isEmpty = filteredGood.length === 0;
    const navigate = useNavigate();

    useEffect(() => {
        const initPage = async () => { 
            //console.log('initPage')
            const goods = await fetchGoods();
            //console.log(goods);
            setGood(goods);
            filter({category: keyword});
        } 
        initPage();
    } , [keyword])

    const renderFilteredGood = filteredGood?.map((good, index) => {
        return (
            <div key={index} className=" flex gap-2 p-2 m-2 justify-center" onClick={() => toGoodPage(good.id)}>
                <HomeCard good={good}/>
            </div>
        )
    })

    const toGoodPage = (goodId) => {
        navigate(`/good/${goodId}`);
    } 

    const CategoriesResult = () => {
        //console.log(isEmpty)
        if (isEmpty) {
            return <div className="text-center">No results found</div>
        } else{
            return <div>{renderFilteredGood}</div>
        }
    }



    return (
        <div>
            <div>SearchResult</div>
            <div>{CategoriesResult()}</div>
        </div>

    )
}    
export default CategoriesResult