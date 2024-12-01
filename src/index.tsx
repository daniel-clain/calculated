import React from "react"
import ReactDOM from "react-dom/client"
import { App_C } from "./frontend/App"
import { AppProvider } from "./frontend/AppContext/AppProvider"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <AppProvider>
      <App_C />
    </AppProvider>
  </React.StrictMode>
)
