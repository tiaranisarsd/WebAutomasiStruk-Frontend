import {BrowserRouter, Routes, Route} from "react-router-dom";
import History from "./pages/History";
import UploadStruk from "./pages/UploadStruk";
import DataStruk from "./pages/DataStruk";
import LoginPages from "./pages/LoginPages";
import NotFoundPage from "./pages/NotFoundPage";
import UsersList from "./pages/UsersList";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";

function App() {
  return (
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<History />}/>
      <Route path="/login" element={<LoginPages />} />
      <Route path="/*" element={<NotFoundPage />} />
      <Route path="/upload-struk" element={<UploadStruk />}/>
      <Route path="/data-struk" element={<DataStruk /> }/>
      <Route path="/users" element={<UsersList />}/>
      <Route path="/users/add" element={<AddUser />}/>
      <Route path="/users/edit/:id" element={<EditUser />}/>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
