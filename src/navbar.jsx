'use client';

import { Button, Navbar } from 'flowbite-react';
import logo from './logo.svg';
import { Routes, Route, Link, useSearchParams, NavigateOptions } from "react-router-dom";
import { NavLink } from "react-router-dom";


export default function NavbarWithCTAButton() {
  let [searchParams, setSearchParams] = useSearchParams();
  const queryParams = searchParams.toString();
  const activeClassName = "block py-2 pr-4 pl-3 md:p-0 bg-cyan-700 text-white dark:text-white md:bg-transparent md:text-cyan-700"
  const inactiveClassName="block py-2 pr-4 pl-3 md:p-0 border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-cyan-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
  const activeClassFunc = (navData) => navData.isActive ? activeClassName : inactiveClassName
  return (
    <Navbar
      fluid
      rounded
    >
      <Navbar.Brand>
        {/* react logo */}
        <svg className="App-logo w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 21">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
        </svg>

        {/* <img className="App-logo" src={logo}></img> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Migrations
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <a href="https://ixybtynp6db.typeform.com/to/KSZKLuJE">
          <Button>
            Add a migration
          </Button>
        </a>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <NavLink className={activeClassFunc} to={`/?${queryParams}`}>Graph</NavLink>
        <NavLink className={activeClassFunc} to={`/table?${queryParams}`}>Table</NavLink>
        <NavLink className={activeClassFunc} to={`/about`}>About</NavLink>
      </Navbar.Collapse>
    </Navbar>
  )
}


