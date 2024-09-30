import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../types/types";
import { UserState } from "../types/types";
import { TranslateText } from "../types/types";

const initialUserState : UserState = {
    access_token: null,
    profile: null,
    id: null
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUser(state, action: PayloadAction<{access_token: string}>) {
            state.access_token = action.payload.access_token;
        },

        setProfile(state, action: PayloadAction<UserProfile>) {
            state.profile = action.payload
            // state.id = action.payload.id
        },

        setId(state, action: PayloadAction<{id: string}>){
            state.id = action.payload.id
        },
        
        clearUser(state){
            state.access_token = null;
            state.profile = null;
            state.id = null;
        }
    }
})


const initialTranslateState : TranslateText = {
    translation: '',
    status: 'idle',
    error:  null
}


const translateSlice = createSlice({
    name: 'translation',
    initialState: initialTranslateState,
    reducers: {
        translationRequested: (state) => {
            state.status = 'loading'
        },

        translationSuccessful: (state, action: PayloadAction<{translation: string}>) => {
            state.status = 'succeeded';
            state.translation = action.payload.translation;
        },

        translationFailed: (state, action: PayloadAction<{error: string | null}>) => {
            state.status = 'failed';
            state.error = action.payload.error;

        }
    }
})

const initialSavedTranslationState = {
    saved: []
}
const savedTranslationSlice = createSlice({
    name: 'savedTranslation',
    initialState: initialSavedTranslationState,
    reducers: {
        saved: (state, action) => {
            state.saved = action.payload;
            localStorage.setItem('savedTranslations', JSON.stringify(state.saved))
        }
    }
})


export const {setUser, setProfile, setId, clearUser} = userSlice.actions;
export const {translationRequested, translationSuccessful, translationFailed} = translateSlice.actions;
export const {saved} = savedTranslationSlice.actions;

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        translation: translateSlice.reducer,
        saved: savedTranslationSlice.reducer
    }
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;