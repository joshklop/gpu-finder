import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons'
import { useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import './Table.css';
import GlobalFilter from './TableGlobalFilter';

export default function Table(_: Object) {
  const data = useMemo(
    () => [
      {
        name: 'gpu',
        price: 0,
      },
      {
        name: 'another-gpu',
        price: 1,
      },
      {
        name: 'another-another-gpu',
        price: 2,
      },
    ],
    []
  );
  const columns = useMemo<Column<{name: string, price: Number}>[]>(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value }) => `\$${value}`,
      },
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
