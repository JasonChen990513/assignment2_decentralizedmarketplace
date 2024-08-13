import { useLoaderData } from "react-router-dom";
import { useState } from "react";


function CategoriesResult() {
    const keyword = useLoaderData(); 

    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = ['Food', 'Electronics', 'Books', 'Clothing', 'Toys', 'Furniture', 'Other'];

    const handleChange = (event) => {
        setSelectedCategory(event.target.value);
    };



    return (
        <div>
            <div>CategoriesResult</div>
            <div>{keyword}</div>
            <div className="category-selector">
                <label htmlFor="category-dropdown" className="block mb-2 text-sm font-medium text-gray-900">
                    Choose a Category
                </label>
                <select
                    id="category-dropdown"
                    value={selectedCategory}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                {selectedCategory && (
                    <div className="mt-4 text-lg">
                        Selected Category: <strong>{selectedCategory}</strong>
                    </div>
                )}
            </div>
        </div>
    )
}    
export default CategoriesResult