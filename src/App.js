import {BrowserRouter, Routes, Route} from "react-router-dom";
import History from "./pages/History";
import UploadStruk from "./pages/UploadStruk";
import DataStruk from "./pages/DataStruk";
import LoginPages from "./pages/LoginPages";
import NotFoundPage from "./pages/NotFoundPage";
import UsersList from "./pages/UsersList";

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
      </Routes>
      </BrowserRouter>
  );
}

export default App;
