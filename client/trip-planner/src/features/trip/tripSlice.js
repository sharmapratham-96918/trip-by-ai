import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const tripSlice = createSlice({
    name : 'trip',
    initialState : {
        travelPlan : null,
        isLoading : false,
        isSuccess : false ,
        isError : false,
        message : "",
    },
   
    reducers : {},
    extraReducers : builder => {
      builder
      .addCase(genratePlan.pending , (state,action)=> {
        state.isLoading = true
        state.isSuccess = false
        state.isError = false
      })
      .addCase(genratePlan.fulfilled , (state,action)=> {
        state.isLoading = false
        state.isSuccess = true
        state.travelPlan = action.payload
        state.isError = false
      })
      .addCase(genratePlan.rejected , (state,action)=> {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = action.payload
      })


   
    }

  })

export default tripSlice.reducer

export const genratePlan = createAsyncThunk("TRIP/GENRATEPLAN" , async(formData) =>{
  try {
    const response = await axios.post("https://trip-by-ai.onrender.com/api/plan" , formData)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.log(error)
  }
})