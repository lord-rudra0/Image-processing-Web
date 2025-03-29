import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ImageEditor from './components/ImageEditor';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/photo-editor"
          element={
            <Layout>
              <ImageEditor />
            </Layout>
          }
        />
        <Route
          path="/compress-image"
          element={
            <Layout>
              <div>Compress Image Page</div>
            </Layout>
          }
        />
        <Route
          path="/resize-image"
          element={
            <Layout>
              <div>Resize Image Page</div>
            </Layout>
          }
        />
        <Route
          path="/crop-image"
          element={
            <Layout>
              <div>Crop Image Page</div>
            </Layout>
          }
        />
        <Route
          path="/convert-to-jpg"
          element={
            <Layout>
              <div>Convert to JPG Page</div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;