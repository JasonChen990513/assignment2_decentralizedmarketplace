import { createSlice } from "@reduxjs/toolkit";


export const goodSlice = createSlice({
    name: 'good',
    initialState: {
        good: [],
        filteredGood: [],
    },
    reducers: {
        setGood: (state, action) => {
            state.good = action.payload;
        },
        filter: (state, action) => {
            console.log('filter')
            const { category } = action.payload;

            // Apply filter based on the category
            state.filteredGood = state.good.filter(good => good.categories === category);

            // If no category is provided, reset to the full list
            if (!category) {
                state.filteredGood = state.good;
            }
        },
        search: (state, action) => {
            console.log('search')
            const keyword  = action.payload.keyword.toLowerCase();

            // Apply search based on the keyword (search in name, description, or category)
            state.filteredGood = state.good?.filter(good =>
                good.name?.toLowerCase().includes(keyword) ||
                good.description?.toLowerCase().includes(keyword) ||
                good.categories?.toLowerCase().includes(keyword)
            );
            console.log('here is slice')
            console.log(state.filteredGood)
            // If no keyword is provided, reset to the full list
            // if (!keyword) {
            //     state.filteredGood = state.good;
            // }
        }

    }
})


export const { setGood, filter, search } = goodSlice.actions;
export default goodSlice.reducer;
