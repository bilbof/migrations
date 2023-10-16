import './App.css';
import NavbarWithCTAButton from './navbar.jsx'
import React, {useEffect} from 'react';
import * as JSURL from "jsurl";
import { Routes, Route, useSearchParams, redirect } from "react-router-dom";
import GraphPage from './GraphPage.js'
import ProductPage from './ProductPage.js'
import AboutPage from './AboutPage';
/**
 * This custom hook is a wrapper around `useSearchParams()` that parses and
 * serializes the search param value using the JSURL library, which permits any
 * JavaScript value to be safely URL-encoded.
 *
 * It's a good example of how React hooks offer a great deal of flexibility when
 * you compose them together!
 *
 * TODO: rethink the generic type here, users can put whatever they want in the
 * URL, probably best to use runtime validation with a type predicate:
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 */
function useQueryParam(key) {
  let [searchParams, setSearchParams] = useSearchParams();
  let paramValue = searchParams.get(key);

  let value = React.useMemo(() => JSURL.parse(paramValue), [paramValue]);

  let setValue = React.useCallback(
    (newValue, options) => {
      let newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, JSURL.stringify(newValue));
      setSearchParams(newSearchParams, options);
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}

function App() {
  let minYear = 2010
  let maxYear = new Date().getFullYear()
  let defaultYear = 2023 // minYear + Math.floor((maxYear - minYear) / 2)
  let [year, setYear] = useQueryParam("year");
  if (!year) {
    year = defaultYear
  }
  function handleYearChange(event) {
    let year = event.target.value
    setYear(year, { replace: true });
  }


  // group filter
  const allGroups = [
    'programming',
    'tool',
    'database',
    'infrastructure',
    'software',
    'writing',
    'place',
    'finance',
    'mobile',
    'library',
  ].sort()
  const defaultActiveGroups = [
    'infrastructure',
  ]
  // const defaultActiveGroups = allGroups
  let [activeGroups, setActiveGroups] = useQueryParam('groups')
  if (!activeGroups) {
    setActiveGroups(defaultActiveGroups)
    activeGroups = defaultActiveGroups
  }
  const onGroupChange = (e) => {
    if (e.target.checked) {
      setActiveGroups([...activeGroups, e.target.id])
    }
    else {
      setActiveGroups(activeGroups.filter(group => group !== e.target.id))
    }
  }
  // node name filter
  let [query, setQuery] = useQueryParam("query");
  if (!query) {
    query = ''
  }
  const handleSearchChange = (e) => {
    setQuery(e.target.value)
  }

  const Redirect = ({ path }) => {
    useEffect(() => {
      redirect(path);
    })
  }

  return (
    <div className="App static">
      <div className="container mx-auto px-4 max-w-full	">
        <div id='navbar'>
        <NavbarWithCTAButton/>
        </div>
        <Routes>
        <Route index path="/" title="Migrations | Graph" element={
            <GraphPage
              page={'graph'}
              year={year} maxYear={maxYear} allGroups={allGroups} activeGroups={activeGroups}
              onGroupChange={onGroupChange} nodeNameFilter={query}
              onNodeNameFilterChange={handleSearchChange} handleYearChange={handleYearChange}
              />
        } />
        <Route path="table" title="Migrations | Graph" element={
          <GraphPage
              year={year} maxYear={maxYear} allGroups={allGroups} activeGroups={activeGroups}
              onGroupChange={onGroupChange} nodeNameFilter={query}
              onNodeNameFilterChange={handleSearchChange} handleYearChange={handleYearChange}
              page={'table'}
          />
        } />
        <Route path="products/:productId" element={<ProductPage/>}></Route>
        <Route path="about" element={<AboutPage/>} title="Migrations | Graph"></Route>
      </Routes>

      </div>
    </div>
  );
}

export default App;
