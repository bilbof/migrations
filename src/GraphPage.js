import DefaultSidebar from './sidebar.jsx'
import DataService from './services/data.js'
import Simple from './Simple.js'
import { Table } from 'flowbite-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'

const truncatedUrl = (url) => {
    let maxLength = 40
    // removes scheme, and truncates path to N chars
    let split = url.replace(/(^\w+:|^)\/\//, '').split('/')
    maxLength = maxLength - split[0].length
    let path = split.slice(1).join('/').substring(0, maxLength)
    let ellipse = path.length < url.length ? '...' : ''
    return split[0] + '/' + path + ellipse
}

export const MigrationsTable = ({ data }) => {
    document.title = "Migrations | Table"
    const defaultState = {
        column: 'points',
        direction: 'desc',
    }
    const [sortColumn, setSortColumn] = useState(defaultState)
    
    const sortIcon = (
        <svg className="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
        </svg>
    )

    const setSortField = (column) => {
        if (column === sortColumn.column && sortColumn.direction === 'asc') {
            setSortColumn({
                column,
                direction: 'desc',
            })
        } else {
            setSortColumn({
                column,
                direction: 'asc',
            })
        }
    }

    const rowsSortedByColumn = data.links.sort((a, b) => {
        if (sortColumn.direction === 'asc') {
            if (a[sortColumn.column] > b[sortColumn.column]) {
                return 1;
            }
            if (a[sortColumn.column] < b[sortColumn.column]) {
                return -1;
            }
        }

        if (sortColumn.direction === 'desc') {
            if (a[sortColumn.column] > b[sortColumn.column]) {
                return -1;
            }
            if (a[sortColumn.column] < b[sortColumn.column]) {
                return 1;
            }
        }
        return 0;
    })
    
    const sort = (header, column) => {
        return (
            <a className="cursor-pointer" onClick={() => setSortField(column)}>
                 <div className="flex items-center">
                    {header}
                    {sortIcon}
                </div>
            </a>
        )
    }

    const linkClasses = "text-blue-600 dark:text-blue-500 hover:underline"
    
    return (
        <div className="grid">
            <div className="text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                Migrations
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                    Migrations that contribute to the <Link to="/migrations" className="text-blue-600 dark:text-blue-500 hover:underline">graph</Link>.
                    These are sourced from the Hacker News API and from individual submissions, you can <Link to="https://ixybtynp6db.typeform.com/to/KSZKLuJE" className="text-blue-600 dark:text-blue-500 hover:underline">add a migration</Link> to improve the accuracy of the migration statistics.
                </p>
            </div>
            <div className="overflow-x-auto">

                <Table className="w-full">
                    
                    <Table.Head>
                        <Table.HeadCell>
                            {sort('From', 'source')}
                        </Table.HeadCell>
                        <Table.HeadCell>
                            {sort('To', 'target')}
                        </Table.HeadCell>
                        <Table.HeadCell>
                            {sort('Company', 'company')}
                        </Table.HeadCell>
                        <Table.HeadCell>
                            {sort('Year', 'value')}
                        </Table.HeadCell>
                        <Table.HeadCell>
                            {sort('Points', 'points')}
                        </Table.HeadCell>
                        <Table.HeadCell>
                            {sort('Comments', 'num_comments')}
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Link
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {rowsSortedByColumn.map((link, idx) => (
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={link.company + link.source + link.target + link.value + link.url}>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" key={idx + 'source'}>
                                    <a href={`/migrations/products/${link.source}`} className={linkClasses}>{link.source}</a>
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" key={idx + 'target'}>
                                    <a href={`/migrations/products/${link.target}`} className={linkClasses}>{link.target}</a>
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" key={idx + 'company'}>
                                    {link.company}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" key={idx + 'value'}>
                                    {link.value}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white" key={idx + 'points'}>
                                    {link.points}
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-blue-600 dark:text-blue-500 hover:underline" key={idx + 'comment'}>
                                    <a href={link.comments_url}>{`${link.num_comments} comments`}</a>
                                </Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-blue-600 dark:text-blue-500 hover:underline" key={idx + 'url'}>
                                    <a href={link.url}>{truncatedUrl(link.url)}</a>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )
}

const GraphPage = ({ page, year, maxYear, allGroups, activeGroups, onGroupChange, nodeNameFilter, onNodeNameFilterChange, handleYearChange }) => {
    const data = DataService({
        activeGroups,
        searchQuery: nodeNameFilter,
        allGroups,
        lastMigration: year,
    });
    const view = page == 'graph' ? <Simple data={data} /> : <div className="p-5"><MigrationsTable data={data} /></div>
    return (
        <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12 lg:col-span-3 xl:col-span-3">
                <DefaultSidebar
                    allGroups={allGroups} activeGroups={activeGroups} onGroupChange={onGroupChange}
                    nodeNameFilter={nodeNameFilter} onNodeNameFilterChange={onNodeNameFilterChange}
                    dateValue={year} onDateChange={handleYearChange} minYear={2010} maxYear={maxYear} />
            </div>
            <div className="col-span-12 lg:col-span-9 xl:col-span-9 h-full" id='graph'>
                {view}
            </div>
        </div>
    );
}

export default GraphPage;