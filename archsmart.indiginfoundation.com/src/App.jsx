import React, { useState, useRef, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import { Hero } from "./components/Hero";
import BlogSection from "./features/blog/components/BlogSection";
import BlogPostPage from "./features/blog/pages/BlogPostPage";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import UnauthorizedPage from "./features/auth/pages/UnauthorizedPage";
import AuthTest from "./features/auth/pages/AuthTest";
import ProtectedRoute from "./routes/ProtectedRoute";
import "react-quill-new/dist/quill.snow.css";
import { Toaster } from 'react-hot-toast';

// Feature-based lazy imports (migrated)
const PropertiesSection = lazy(() => import("./features/properties/components/PropertiesSection"));

// Services and Smart Living moved to feature folders
const ServicesSection = lazy(() => import("./features/services/components/ServicesSection"));
const SmartLivingSection = lazy(() => import("./features/smartLiving/components/SmartLivingSection"));
const EducationSection = lazy(() => import("./components/EducationSection.jsx")); // consider feature grouping
const ContactSection = lazy(() => import("./components/ContactSection"));

// Auth Pages (migrated) - lazy loaded
const SignupPage = lazy(() => import("./features/auth/pages/Signup"));
const LoginPage = lazy(() => import("./features/auth/pages/Login"));
const AdminLogin = lazy(() => import("./features/auth/pages/AdminLogin"));

// Agent + Admin Pages
const SinglePropertyPage = lazy(() => import("./features/properties/pages/SinglePropertyPage"));
const AgentPropertiesPage = lazy(() => import("./features/properties/pages/AgentPropertiesPage"));
const DashboardUser = lazy(() => import("./pages/DashboardUser"));
const DashboardAgent = lazy(() => import("./pages/DashboardAgent"));
const DashboardAdmin = lazy(() => import("./pages/DashboardAdmin"));
const DashboardProperties = lazy(() => import("./pages/DashboardProperties"));
const DashboardUsers = lazy(() => import("./pages/DashboardUsers"));
const DashboardBlog = lazy(() => import("./pages/DashboardBlog"));
const DashboardInquiries = lazy(() => import("./pages/DashboardInquiries"));
const DashboardConsultations = lazy(() => import("./pages/DashboardConsultations"));
const DashboardSettings = lazy(() => import("./pages/DashboardSettings"));
const DashboardProfile = lazy(() => import("./pages/DashboardProfile"));

// Smart Living + Services (migrated)
const SmartLighting = lazy(() => import("./features/smartLiving/pages/SmartLighting"));
const SecuritySystems = lazy(() => import("./features/smartLiving/pages/SecuritySystems"));
const ClimateControl = lazy(() => import("./features/smartLiving/pages/ClimateControl"));
const HomeAutomation = lazy(() => import("./features/smartLiving/pages/HomeAutomation"));
const PropertySales = lazy(() => import("./features/services/pages/PropertySales"));
const PropertyRentals = lazy(() => import("./features/services/pages/PropertyRentals"));
const SmartHomeInstallation = lazy(() => import("./features/services/pages/SmartHomeInstallation"));
const InteriorDesign = lazy(() => import("./features/services/pages/InteriorDesign"));
const InvestmentConsulting = lazy(() => import("./features/services/pages/InvestmentConsulting"));
const PropertyManagements = lazy(() => import("./features/services/pages/PropertyManagements"));
const FAQ = lazy(() => import("./features/services/pages/FAQ"));

// ... (rest of the file)
function MainContent({ activeSection, setActiveSection }) {
  const [searchFilters, setSearchFilters] = useState(null);
  const propertiesRef = useRef(null);

  const handleSearchProperties = (filters) => {
    setSearchFilters(filters);
    setActiveSection("properties");
    setTimeout(() => {
      propertiesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  switch (activeSection) {
    case "home":
      return <Hero onSearchProperties={handleSearchProperties} />;
    case "properties":
      return (
        <div ref={propertiesRef}>
          <PropertiesSection searchFilters={searchFilters} />
        </div>
      );
    case "smart-living":
      return <SmartLivingSection />;
    case "education":
      return <EducationSection />;
    case "blog":
      return <BlogSection />;
    case "contact":
      return <ContactSection />;
    default:
      return (
        <>
          <Hero onSearchProperties={handleSearchProperties} />
          <div ref={propertiesRef}>
            <PropertiesSection searchFilters={searchFilters} />
          </div>
        </>
      );
  }
}

function DashboardUserRoute() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <DashboardUser />
    </Suspense>
  );
}

// -------------------- AppContent Component --------------------
function AppContent() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-grow">
  <Routes>
          {/* Public */}
          <Route
            path="/"
            element={
              <Suspense fallback={<div className="p-6">Loading…</div>}>
                <MainContent
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
              </Suspense>
            }
          />
          <Route path="/properties" element={<Suspense fallback={<div className="p-6">Loading…</div>}><PropertiesSection /></Suspense>} />
          <Route path="/services" element={<Suspense fallback={<div className="p-6">Loading…</div>}><ServicesSection /></Suspense>} />
          <Route path="/smart-living" element={<Suspense fallback={<div className="p-6">Loading…</div>}><SmartLivingSection /></Suspense>} />
          <Route path="/home-automation" element={<Suspense fallback={<div className="p-6">Loading…</div>}><HomeAutomation /></Suspense>} />
          <Route 
            path="/education" 
            element={
              <ProtectedRoute roles={["user", "agent", "admin"]} redirectTo="/signup">
                <Suspense fallback={<div className="p-6">Loading…</div>}><EducationSection /></Suspense>
              </ProtectedRoute>
            } 
          />
          <Route path="/blog" element={<BlogSection />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<Suspense fallback={<div className="p-6">Loading…</div>}><ContactSection /></Suspense>} />

          {/* Auth */}
          <Route path="/signup" element={<Suspense fallback={<div className="p-6">Loading…</div>}><SignupPage /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<div className="p-6">Loading…</div>}><LoginPage /></Suspense>} />
          <Route path="/admin/login" element={<Suspense fallback={<div className="p-6">Loading…</div>}><AdminLogin /></Suspense>} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/auth-test" element={<AuthTest />} />
          <Route path="/properties/:id" element={<Suspense fallback={<div className="p-6">Loading…</div>}><SinglePropertyPage /></Suspense>} />
          <Route path="/properties/agent/:agentId" element={<Suspense fallback={<div className="p-6">Loading…</div>}><AgentPropertiesPage /></Suspense>} />

          {/* Dashboards (protected) */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute roles={["user", "agent", "admin"]}>
                <DashboardUserRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute roles={["user", "agent", "admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardProfile /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/settings"
            element={
              <ProtectedRoute roles={["user", "agent", "admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardSettings /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute roles={["agent"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardAgent /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/profile"
            element={
              <ProtectedRoute roles={["agent"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardProfile /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/settings"
            element={
              <ProtectedRoute roles={["agent"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardSettings /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardAdmin /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/properties"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardProperties /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardUsers /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/blog"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardBlog /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/inquiries"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardInquiries /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/consultations"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardConsultations /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardSettings /></Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Suspense fallback={<div className="p-6">Loading…</div>}><DashboardProfile /></Suspense>
              </ProtectedRoute>
            }
          />
          
          {/* Smart Living */}
          <Route path="/smart-lighting" element={<Suspense fallback={<div className="p-6">Loading…</div>}><SmartLighting /></Suspense>} />
          <Route path="/security-systems" element={<Suspense fallback={<div className="p-6">Loading…</div>}><SecuritySystems /></Suspense>} />
          <Route path="/climate-control" element={<Suspense fallback={<div className="p-6">Loading…</div>}><ClimateControl /></Suspense>} />

          {/* Services */}
          <Route path="/services/propertysales" element={<Suspense fallback={<div className="p-6">Loading…</div>}><PropertySales /></Suspense>} />
          <Route path="/services/propertyrentals" element={<Suspense fallback={<div className="p-6">Loading…</div>}><PropertyRentals /></Suspense>} />
          <Route path="/services/smarthomeinstallation" element={<Suspense fallback={<div className="p-6">Loading…</div>}><SmartHomeInstallation /></Suspense>} />
          <Route path="/services/interiordesign" element={<Suspense fallback={<div className="p-6">Loading…</div>}><InteriorDesign /></Suspense>} />
          <Route path="/services/investmentconsulting" element={<Suspense fallback={<div className="p-6">Loading…</div>}><InvestmentConsulting /></Suspense>} />
          <Route path="/services/propertymanagements" element={<Suspense fallback={<div className="p-6">Loading…</div>}><PropertyManagements /></Suspense>} />
          <Route path="/services/faq" element={<Suspense fallback={<div className="p-6">Loading…</div>}><FAQ /></Suspense>} />

          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// -------------------- App Component --------------------
function App() {
  return (
    <AuthProvider> 
      <ScrollToTop />
      <Toaster />
      <ChatWidget />
      <AppContent />
    </AuthProvider>
  );
}


export default App;
