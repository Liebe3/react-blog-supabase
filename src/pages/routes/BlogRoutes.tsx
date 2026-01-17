import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "../auth/components/ProtectedRoute";
import Layout from "../layout/Layout";

import About from "../AboutPage";
import Contact from "../ContactPage";
import CreatePost from "../CreateBlogPage";
import Home from "../HomePage";
import Login from "../auth/LoginPage";
import Register from "../auth/RegisterPage";
import BlogDetails from "../auth/components/BlogDetails";

const BlogRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreatePost />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/blogs/:id"
        element={
          <Layout>
            <BlogDetails />
          </Layout>
        }
      />

      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

export default BlogRoutes;
