import { useMemo } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import styled from 'styled-components';
import { Log } from "../shared/api/logging/typings";
import * as dayjs from 'dayjs'

const Styles = styled.div`
  padding: 1rem;
  table {
    margin: 0px auto;
    width: 1200px;
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

const JSON: Log[] = [
  {
    level: "ERROR",
    message: "hello there!",
    userId: "342342",
    timestamp: "2021-07-09 20:56:47",
  },
  {
    level: "ERROR",
    message: "hello there!",
    userId: "342342",
    timestamp: "2020-07-09 20:56:47",
  },
  {
    level: "EVENT",
    message: "hello there!",
    userId: "342342",
    timestamp: "2018-07-09 20:56:47",
  },
  {
    level: "EVENT",
    message: "hello there!",
    userId: "342342",
    timestamp: "2022-07-09 20:56:47",
  },
  {
    level: "ERROR",
    message: "hello there!",
    userId: "342342",
    timestamp: "2022-07-09 20:56:47",
  },
];

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: any) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}: any) {
  const options = useMemo(() => {
    const options = new Set();
    //@ts-ignore
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()] as string[];
  }, [id, preFilteredRows]);

  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

const Table = ({ data }: { data: Log[] }) => {
  const columns = useMemo(
    () =>
      [
        {
          Header: "Level",
          accessor: "level",
          Filter: SelectColumnFilter,
          disableSortBy: true,
        },
        {
          Header: "Message",
          accessor: "message",
          disableFilters: true,
          disableSortBy: true,

        },
        {
          Header: "User ID",
          accessor: "userId",
          disableFilters: true,
          disableSortBy: true,
        },
        {
          Header: "Date",
          accessor: "timestamp",
          sortType: (a: any, b: any) => {
            //@ts-ignore
            return new Date(b.values.timestamp) - new Date(a.values.timestamp);
          },
          disableFilters: true,
        },
      ] as const,
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
                    //@ts-ignore
        columns,
        data,
      }, 
      useFilters,
      useSortBy,
    );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (            //@ts-ignore

              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <div>
                  {
                    //@ts-ignore
                    column.canFilter ? column.render("Filter") : null
                  }
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const App = () => {
  const data = useMemo(() => JSON, []);

  return (
    <>
      <Styles>
        <Table data={data} />
      </Styles>
    </>
  );
};
