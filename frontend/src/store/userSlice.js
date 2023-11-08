import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'



export const userSlice = createSlice({
  name: 'user',
  initialState: {
    dao:undefined,
    selectedAddress: undefined,
    balance: 0,
    error: undefined,
    disabled: true,
    proporsals:[],
    acceptedProporsals:[],
    joinProporsals:[]
  },
  reducers: {
    setDAO: (state, action) => {
      state.dao = action.payload
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setDisabled:(state,action)=>{
      state.disabled=action.payload;
    },
    setProporsals:(state,action)=>{
      state.proporsals=action.payload;
    },
    setAcceptedProporsals:(state,action)=>{
      state.acceptedProporsals=action.payload;
    },
    setJoinedProporsals:(state,action)=>{
      state.joinProporsals=action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const {setDAO, setSelectedAddress, setBalance, setError, setDisabled,setProporsals,setAcceptedProporsals,setJoinedProporsals } = userSlice.actions

export default userSlice.reducer