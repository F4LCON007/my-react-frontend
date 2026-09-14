// src/App.jsx
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Item from "./Item";
import User from "./User";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route path="item" element={<Item />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;