import React, { useEffect, useState } from "react";
import axios from "axios";
import "./table.css";

function TableComponent() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getData");
        const responseData = response.data;
        console.log("responseData", responseData);
        setTableData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Platform</th>
          <th>Last Traded Price</th>
          <th>Buy/Sell Price</th>
          <th>Difference</th>
          <th>Savings</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{row.name}</td>
            <td>{row.last}</td>
            <td>
              {row.buy}/{row.sell}
            </td>
            <td>{row.buy - row.sell}</td>
            <td>{row.volume}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableComponent;
