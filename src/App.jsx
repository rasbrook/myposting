import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import Course from "./pages/course"
import Chapter from "./pages/chapter"
import Edit from "./pages/edit"
import AddQuestions from "./pages/question"





function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:course" element={<Course />} />
        <Route path="/course/:courseid/:chapter" element={<Chapter />} />
        <Route path="/course/chapter/content/:id" element={<Edit />} />
        <Route path="/content/:id/questions" element={<AddQuestions />} />



      </Routes>


    </BrowserRouter>




  )
}

export default App
