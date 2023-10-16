'use client';

import { Sidebar, Checkbox, Label, Button } from 'flowbite-react';
import RangeSliderElement from './range.jsx';
function ProductGroup(activeGroups, product, onGroupChange) {
  const checked = activeGroups.includes(product)
  return (
    <Sidebar.Item key={product}>
      <div className="flex items-center gap-2">
      <Checkbox id={product} onChange={onGroupChange} checked={checked} />
      <Label htmlFor={product}>
        {product}
      </Label>
      </div>
    </Sidebar.Item>
  )
}

export default function DefaultSidebar({
  allGroups, activeGroups, onGroupChange, nodeNameFilter, onNodeNameFilterChange,
  dateValue, onDateChange, maxYear
}) {
  const groupFilters = allGroups.map((product) => {
    return ProductGroup(activeGroups, product, onGroupChange)
  })

  const placeholder = "Search for a node..."
  const toggleSideBar = () => {
    // not very 'react' but whatever
    const sidebar = document.querySelector('.sidebar')
    sidebar.classList.toggle('hidden')
  }
  return (
    <div class="grid">
      <button onClick={toggleSideBar} data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="lg:hidden inline-flex p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span class="sr-only">Open sidebar</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>
      <Sidebar aria-label="Default sidebar example" className="sidebar h-full w-50 hidden lg:block">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <p style={{'textAlign': "left", 'marginLeft': "20px"}}>Filters</p>
            {groupFilters}
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <RangeSliderElement dateValue={dateValue} onDateChange={onDateChange} minYear={2010} maxYear={maxYear}/>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <p style={{'textAlign': "left", 'marginLeft': "20px"}}>Search</p>
            <Sidebar.Item>
              <div className="flex items-center gap-2">
                <input type="text" placeholder={placeholder} id="nodeNameFilter" onChange={onNodeNameFilterChange} value={nodeNameFilter} className="w-full" />
              </div>
            </Sidebar.Item>
            <span id="search-help" className="text-gray-400 text-xs">Partial, comma-separated and "exact" match queries supported.</span>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
              <a href="https://ixybtynp6db.typeform.com/to/KSZKLuJE">
              <div className='flex'>
                <Button className='w-full'>
                  Add a migration
                </Button>
            </div>
            </a>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <a href="https://www.buymeacoffee.com/billfranklin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{'height': "60px !important", 'width': "217px !important" }}></img></a>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  )
}


