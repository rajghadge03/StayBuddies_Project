import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostProperty from "./pages/PostProperty";
import ViewRooms from "./pages/ViewRooms";
import PropertyDetails from "./pages/PropertyDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/postproperty" element={<PostProperty />} />
      <Route path="/findroom" element={<ViewRooms />} />
      <Route path="/property/:id" element={<PropertyDetails />} />

    </Routes>
  );
}

export default App;
