"use client"

import { Provider } from "react-redux"
import store from "../redux/store" // make sure path is correct
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import SessionProviderWrapper from "./SessionProviderWrapper"
import { ThemeProvider } from "./themeProvider"

export default function ClientProviders({ children }) {
    return (
        <SessionProviderWrapper>
            <Provider store={store}>
                <ThemeProvider>
                    {children}
                    <ToastContainer
                        position="top-center"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </ThemeProvider>
            </Provider>
        </SessionProviderWrapper>
    )
}
