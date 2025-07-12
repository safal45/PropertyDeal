import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './components/home/Home';
import About from './components/about/About';
import "./App.css";
import Thanks from './components/thanks/Thanks';
import Preview from './components/preview/Preview';
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/more-detail" element={<About />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/preview" element={<Preview />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;