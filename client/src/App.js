import React, { useEffect, useState } from "react";
import { Table, Select, Button, message, Spin } from "antd";
import { transformData } from "./scripts";
import { columnsHeaders } from "./tabelsColumn";

const NUM_OF_LINES_ON_ONE_PAGE = 20;
const SRC_URL = "http://localhost:5001/api/stock?mark=";

const urlCombiner = (arrOfMarks = []) => SRC_URL + arrOfMarks.join(",");

const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const App = () => {
  const [data, setData] = useState();
  const [marks, setMarks] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: NUM_OF_LINES_ON_ONE_PAGE,
    },
  });

  const fetchCarsData = async () => {
    setLoading(true);
    try {
      const res = await fetch(urlCombiner(selectedModels));
      if (!res.ok) throw new Error("Fetch cars is not okey");
      const result = await res.json();
      setData(transformData(result));
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: result.length,
        },
      });
    } catch (error) {
      message.error("Error fetching data form server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarksData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/stock/marks`);
      if (!response.ok) throw new Error("Fetch cars marks is not okey");
      const result = await response.json();
      setMarks(result);
    } catch (error) {
      message.error("Error fetching data form server: " + error.message);
    }
  };

  useEffect(() => {
    fetchMarksData();
    fetchCarsData();
  }, [
    selectedModels,
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ]);

  const handleTableChange = (pagination) => {
    setTableParams({
      pagination,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleModelChange = (value) => {
    if (Array.isArray(value)) {
      setSelectedModels(value);
    } else {
      setSelectedModels([value]);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <div>
        {marks && marks.length > 0 ? (
          marks.map((el, index) => (
            <Button onClick={() => handleModelChange(el._id)} key={index}>
              {el._id + " " + el.count + " "}
            </Button>
          ))
        ) : (
          <Select.Option disabled>Нет доступных данных</Select.Option>
        )}
      </div>
      <div> Модели:</div>
      <Select
        mode="multiple"
        style={{ width: "300px" }}
        placeholder="Выберите модель"
        onChange={handleModelChange}
        value={selectedModels}
      >
        {marks && marks.length > 0 ? (
          marks.map((mark, index) => (
            <Select.Option key={index} value={`${mark._id}`}>
              {mark._id}
            </Select.Option>
          ))
        ) : (
          <Select.Option disabled>Нет доступных данных</Select.Option>
        )}
      </Select>
      <Spin spinning={loading}>
        <Table
          columns={columnsHeaders}
          dataSource={data}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};
export default App;
