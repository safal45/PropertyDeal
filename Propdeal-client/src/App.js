import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './Layout';
import Home from './components/home/Home';
import About from './components/about/About';
import "./App.css";
import Thanks from './components/thanks/Thanks';
import Preview from './components/preview/Preview';
import PropertyDetail from './components/propertydetail/PropertyDetail';

function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">
      <div className="bg-white rounded-[14px] border border-[#E5E7EB] shadow-sm p-10 text-center max-w-md w-full">
        <p className="font-MerriweatherSans text-[64px] text-[#E5E7EB] leading-none select-none">404</p>
        <p className="font-MerriweatherSans text-[22px] text-[#122B49] mt-4">Page not found</p>
        <p className="font-Inter text-[14px] text-[#7A7A7A] mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 bg-[#122B49] text-white font-Inter font-medium text-[14px] px-6 py-3 rounded-[8px] hover:bg-[#091524] transition-colors"
        >
          Back to listings
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/more-detail" element={<About />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;