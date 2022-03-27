import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import { useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import './Table.css';
import GlobalFilter from './TableGlobalFilter';
import src1 from './gpu1.png';
import src2 from './gpu2.png';
import src3 from './gpu3.png';

export default function Table(_: Object) {
  const data = useMemo(
    () => [
      {
        name: 'Open Box: GIGABYTE Radeon RX 6900 XT',
        price: 1249,
        image: src1,
      },
      {
        name: 'NVIDIA GeForce RTX 3090',
        price: 2238.39,
        image: src2,
      },
      {
        name: 'AMD Radeon RX 6800 XT CORE',
        price: 1099,
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
        Cell: ({ value }) => <a href='https://www.newegg.com/gigabyte-radeon-rx-6900-xt-gv-r69xtgaming-oc-16gd/p/N82E16814932414R'>{value}</a>,
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
        Cell: ({ value }) => <img height={100} width={200} src={value}/>,
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
