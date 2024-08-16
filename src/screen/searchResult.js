import { useLoaderData } from "react-router-dom";
import { useActionsCreator } from "../hook/useActionsCreator";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchGoods } from "../hook/getGoods";
import HomeCard from "../component/homePageCard";
import { useNavigate } from "react-router-dom";

function SearchResult() {
    const keyword = useLoaderData(); 
    const { setGood, search } = useActionsCreator();
    const filteredGood = useSelector(state => state.good.filteredGood);
    const isEmpty = filteredGood.length === 0;
    const navigate = useNavigate();
    useEffect(() => {
        const initPage = async () => { 
            //console.log('initPage')
            const goods = await fetchGoods();
            //console.log(goods);
            setGood(goods);
            search({keyword: keyword});
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

    const SearchResult = () => {
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
            <div>{SearchResult()}</div>
        </div>

    )
}

export default SearchResult