import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LayersIcon from "@mui/icons-material/Layers";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateTotalCartItems } from "../Redux/Slice/CartSlice";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useSelector } from "react-redux";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const { user } = useUser();

  useEffect(() => {
    const updatingCartItems = async () => {
      try {
        const username = localStorage.getItem("UserName");
        const response = await axios.get(
          "https://taste-buds-treat-backend.vercel.app/api/cart/show-cart",
          {
            headers: { username },
          }
        );
        // Return the length of the items in the cart
        return response.data.data.length;
      } catch (error) {
        console.error("Error fetching cart data:", error);
        return 0; // Default to 0 in case of an error
      }
    };

    if (user?.fullName) {
      localStorage.setItem("UserName", user.fullName);
      localStorage.setItem("email", user.emailAddresses[0].emailAddress); // Ensure correct email address is stored
      console.log("User logged in:", user.fullName);

      // Update total cart items after fetching
      updatingCartItems().then((total) =>
        dispatch(updateTotalCartItems(total))
      );
    } else {
      // Clear specific user-related items from local storage
      localStorage.removeItem("UserName");
      localStorage.removeItem("email");
      console.log("User logged out, localStorage cleared");
    }
  }, [user, dispatch]);

  const totalItems = useSelector((state) => state.cart.TotalCartItems);

  return (
    <>
      <nav>
        <div className="flex p-1 max-md:p-1">
          <div className="w-full flex font-WorkSans items-center justify-center text-black relative">
            <img
              src="https://res.cloudinary.com/dmxlqw5ix/image/upload/v1731066887/qxhi70lws9tx5ssy8ff3.png"
              className="h-20 max-md:h-16"
              alt="Logo"
            />
            <div className="flex w-screen justify-center ml-20">
              <ul className=" flex max-md:hidden justify-end text-2xl nav font-normal gap-4">
                <li className="mr-8 mt-1 hover:text-darkOlive">
                  <NavLink to="/">Home</NavLink>
                </li>
                <li className="mr-8 mt-1 hover:text-darkOlive">
                  <NavLink to="/About">About</NavLink>
                </li>
                <li className="mr-8 mt-1 hover:text-darkOlive">
                  <NavLink to="/Menu">Menu</NavLink>
                </li>
                <li className="mr-6 mt-1 hover:text-darkOlive">
                  <NavLink to="/Contact-Us">Contact-Us</NavLink>
                </li>
              </ul>
            </div>
            <div className="flex gap-8 mr-3 w-60">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className=" max-md:text-sm max-md:py-1 max-md:w-[5.2rem] max-md:px-2 px-5 py-2 rounded-[20px] text-white bg-green-500 hover:bg-olive font-semibold shadow-md transition duration-300 transform hover:scale-105">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
                <NavLink
                  to="/Cart"
                  className="flex items-center justify-center"
                >
                  {/* Display total items in the cart */}
                  <p className="relative left-8 bottom-4 text-white bg-red-400 px-2 rounded-full text-sm">
                    {totalItems || 0}
                  </p>

                  <ShoppingCartIcon className="hover:text-darkOlive" />
                </NavLink>
              </SignedIn>
              <div className="md:hidden flex">
                {isMenuOpen === true ? (
                  <button onClick={toggleMenu}>
                    <CloseIcon className="text-black" />
                  </button>
                ) : (
                  <button onClick={toggleMenu} className="text-black">
                    <MenuIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay Menu */}
      <div
        className={`absolute top-16 left-0 w-full overflow-hidden bg-black/60 text-white z-30 flex flex-col items-center py-4 md:hidden  transform ${
          isMenuOpen ? "-translate-x-0" : "translate-x-full hidden"
        } transition-transform duration-300 ease-in-out`}
      >
        <ul className="text-white text-xl flex flex-col justify-center items-center font-medium font-work space-y-4">
          <li>
            <NavLink
              to="/"
              className="gap-2 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-white"
              onClick={toggleMenu}
            >
              <HomeIcon className="text-white" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className="gap-2 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-white"
              onClick={toggleMenu}
            >
              <PersonIcon className="text-white" />
              About-Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              className="gap-2 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-white"
              onClick={toggleMenu}
            >
              <LayersIcon className="text-white" />
              Menu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact-us"
              className="gap-2  flex items-center bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-white"
              onClick={toggleMenu}
            >
              <PhoneIcon className="text-white" />
              Contact-Us
            </NavLink>
          </li>
        </ul>
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
