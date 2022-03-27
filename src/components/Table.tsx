import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import { useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import './Table.css';
import GlobalFilter from './TableGlobalFilter';
import src1 from './gpu.jpeg';
import src2 from './gpu2.jpeg';
import src3 from './gpu3.jpeg';

import { API, graphqlOperation } from 'aws-amplify';
import { fetchedVideoCards } from '../graphql/queries';

export default function Table(_: Object) {
  const data = useMemo(
    () => [
      {
        name: 'nvidia-geforce',
        price: 500,
        image: src2,
      },
      {
        name: 'nvidia-tesla',
        price: 389.99,
        image: src1,
      },
      {
        name: 'asus-tuf',
        price: 181,
        image: src3,
      },
    ],
    []
  );
  const columns = useMemo<Column<{name: string, price: Number, image: string}>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => <a href="https://www.amazon.com/NVIDIA-900-22080-0000-000-PCI-Express-Passive-Cooling/dp/B01JBMII42/ref=sr_1_2?crid=RKPSLN4665B1&keywords=nvidia+tesla&qid=1648368205&sprefix=nvidia+tesla%2Caps%2C108&sr=8-2">{value}</a>
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value }) => `\$${value}`,
      },
      {
        Header: 'Image',
        accessor: 'image',
        disableSortBy: true,
        disableFilters: true,
        Cell: ({ value }) => <img height={100} width={100} src={value}/>,
      }
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
   } = useTable(
     { columns, data, },
     useGlobalFilter,
     useSortBy,
   );

   const { globalFilter } = state;

  return (
    <div className='TableAndFilter'>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
    <table {...getTableProps()}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                 {column.render('Header')}
                 <span>
                   {' '}
                   {column.isSorted ? (column.isSortedDesc ? <FontAwesomeIcon icon={faAngleDown}/> : <FontAwesomeIcon icon={faAngleUp}/>) : ''}
                 </span>
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td {...cell.getCellProps()}>
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
  </div>)
}
