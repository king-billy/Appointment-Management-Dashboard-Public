import React, { useState, useEffect } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge } from "antd";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // Function to check if the window width is below the mobile threshold
  const isMobileWidth = () => window.innerWidth <= 768; // Adjust the threshold as needed

  // Function to update the 'collapsed' state based on the window width
  const updateCollapsedState = () => {
    setCollapsed(isMobileWidth());
  };

  // useEffect hook to set the initial state and add a 'resize' event listener
  useEffect(() => {
    updateCollapsedState(); // Set the initial state

    // Add a 'resize' event listener to update the state when the window is resized
    const handleResize = () => {
      updateCollapsedState();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup: Remove the 'resize' event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };}, []);
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Faculty Registration",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    }
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      path: "/admin/userslist",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/admin/doctorslist",
      icon: "ri-user-star-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar" style={{ display: collapsed && isMobileWidth() ? 'none' : 'block' }}>
          <div className="sidebar-header">
            {collapsed ? (
                <h1 className="logo">HC</h1>
            ) : (
                <h1 className="logo">Hill Candy Hospital</h1>
            )}

          </div>

          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`d-flex menu-item `}
              onClick={() => {
                window.localStorage.clear();
                navigate("/login");
                window.location.reload()
              }}
            >
              <i className="ri-logout-circle-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>

        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotifications.length}
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-line header-action-icon px-3"></i>
              </Badge>

              <h1 className="anchor mx-2">
                {user?.name}
              </h1>
            </div>
          </div>

          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
