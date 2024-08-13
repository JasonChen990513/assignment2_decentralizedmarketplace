import { useLoaderData } from "react-router-dom";
import { useActionsCreator } from "../hook/useActionsCreator";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGoods } from "../hook/getGoods";

function SearchResult() {
    const keyword = useLoaderData(); 
    const { setGood, search } = useActionsCreator();
    const filteredGood = useSelector(state => state.good.filteredGood);
    const isEmpty = filteredGood.length === 0;
    useEffect(() => {
        const initPage = async () => { 
            console.log('initPage')
            const goods = await fetchGoods();
            console.log(goods);
            setGood(goods);
            search({keyword: keyword});
        } 
        initPage();
    } , [keyword])

    const renderFilteredGood = filteredGood?.map((good, index) => {
        return (
            <div key={index} className=" flex gap-2 p-2 m-2">
                <div>{good.name}</div>
                <div>{good.description}</div>
                <div>{good.price}</div>
                <div>{good.owner}</div>
                <div>{good.amount}</div>
                <img src={good.image} className="w-20 h-20"/>
                <div>{good.categories}</div>
            </div>
        )
    })

    const SearchResult = () => {
        console.log(isEmpty)
        if (isEmpty) {
            return <div>No results found</div>
        } else{
            return <div>{renderFilteredGood}</div>
        }
    }

    return (
        <div>
            <div>SearchResult</div>
            <div>{SearchResult()}</div>
        </div>

    )
}

export default SearchResult