import { createBrowserRouter,NavLink, Outlet  } from "react-router-dom";
import '../index.css';
import HomePage from "./homePage";
import AddGoods from "./addGood";
import Cart from "./cart";
import Profile from "./profile";
import Good from "./good";
import App from "../App";
import SearchResult from "./searchResult";
import CategoriesResult from "./categoriesResult";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { categories } from "../const";


export const Root = () => {  
    const [keyWord, setKeyWord] = useState("");
    const navigate = useNavigate();


    const setSearchList = async() => {
        console.log("into search function"); 
        const newPath = `/search/${keyWord}`;
        if(keyWord === "") {
            alert("Please input keyword");
            return;
        }

        if (window.location.pathname === newPath) {
            // If the current path starts with /search, reload the page
            console.log("samepage");
            window.location.reload();
        } else {
            // If not, redirect to /search
            console.log("not samepage");
            navigate(newPath);
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearchList();
        }
    }

    const handleClick = () => {
        setSearchList();
    }

    const rederCategories = categories?.map((category, index) => {
        return (
            <div key={index} className=" flex gap-2 p-2 m-2 cursor-pointer" onClick={() => navigate(`/search/${category}`)}>
                {category}
            </div>
        )
    })

    return (
        <header className="">
			<nav className=" flex gap-2 justify-center m-4 items-center">
                <NavLink to='/homepage' style={({ isActive }) => (isActive ? { color: 'red' } : {})}>
                    Home
                </NavLink>
                <NavLink to='/test' className={({ isActive }) => (isActive ? 'text-red-500' : '')}>
                    Test
                </NavLink>
                <div className="border border-gray-300 rounded-lg p-1 w-1/3 flex justify-between items-center" >
                    <input 
                        type="text" 
                        placeholder="search" 
                        className="w-full focus: outline-none"
                        value={keyWord} 
                        onKeyPress={handleKeyPress}
                        onChange={e => setKeyWord(e.target.value)}/>
                    <FaSearch className="hover:cursor-pointer" onClick={handleClick}/>
                </div>

                <NavLink to='/addgoods' className={({ isActive }) => (isActive ? 'text-red-500' : '')}>
                    addGoods
                </NavLink>
                <NavLink to='/profile' className={({ isActive }) => (isActive ? 'text-red-500' : '')}>
                    profile
                </NavLink>
                <NavLink to='/cart' style={({ isActive }) => (isActive ? { color: 'red' } : {})}>
                    cart
                </NavLink>


                
            </nav>
            <div className="flex justify-center">
                <div className="flex justify-center gap-2 w-1/2 item">{rederCategories}</div>
            </div>
           
            <Outlet />
		</header>
    )


}

const Router = createBrowserRouter([    
    {
        path: "/",
        element: <Root/>,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "homepage",
                element: <HomePage/>,
            },
            {
                path: "addgoods",
                element: <AddGoods />,
            },
            {
                path: "cart",
                element: <Cart />,   
            },
            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "good/:id",
                element: <Good />,
                loader: async ({params}) => {
                    const id = params.id;
                    return id;
                },    
            },
            {
                path: "test",
                element: <App/>
            },
            {
                path: "search/:keyword",
                element: <SearchResult/>,
                loader: async ({params}) => {
                    const keyword = params.keyword;
                    return keyword;
                },  
            },
            {
                path: "categories/:keyword",
                element: <CategoriesResult/>,
                loader: async ({params}) => {
                    const keyword = params.keyword;
                    return keyword;
                },  
            }
        ]
    },
    

]);

export default Router;