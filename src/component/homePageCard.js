
function HomeCard({good}) {

    return (
        <div className={`flex gap-2 p-2 m-2 ${!good.sellStatus ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`}>
            <div>
                <img src={good.image} className="w-20 h-20" alt={good.name}/>
            </div>
            <div>
                <div>{good.name}</div>
                <div>Price: {good.price} SKY Token</div>
                <div>Category: {good.categories}</div>
            </div>
        </div>
    )
}

export default HomeCard;