import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.scss";
import { Provider } from "react-redux";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import { BrowserRouter } from "react-router-dom";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { getUsers } from "./actions/users.actions";
import { composeWithDevTools } from "redux-devtools-extension";
import { getPosts } from "./actions/post.actions";

const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk)),
);

store.dispatch(getUsers());
store.dispatch(getPosts());

createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>
	</React.StrictMode>,
);
