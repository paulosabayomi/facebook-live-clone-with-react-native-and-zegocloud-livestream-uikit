import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { IMainState, TUserDetail } from './types'



// Define the initial state using that type
const initialState: IMainState = {
  userDetail: {} as TUserDetail,
}

export const mainSlice = createSlice({
  name: 'main',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUserDetail: (state, action: PayloadAction<TUserDetail>) => {
      state.userDetail = action.payload
    },
  },
})

export const { 
    setUserDetail 
} = mainSlice.actions

export default mainSlice.reducer