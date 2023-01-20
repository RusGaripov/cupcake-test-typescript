import React, { useEffect, useState } from "react";
import { ratesNames } from "../helpers/constants";

type INewObjects = {
  name: string;
  first: string;
  second: string;
  third: string;
};

type IDateFromSources = {
  base: string;
  date: string;
  timestamp: string;
  rates: IRates;
};

type IRates = {
  RUB: number;
  USD: number;
  EUR: number;
};

const MainComponent = () => {
  const [dataFirst, setDataFirst] = useState<IDateFromSources | any>({});
  const [dataSecond, setDataSecond] = useState<IDateFromSources | any>({});
  const [dataThird, setDataThird] = useState<IDateFromSources | any>({});
  const [newArray, setNewArray] = useState<INewObjects[]>([]);
  const [minRateArr, setMinRateArr] = useState<number[]>([]);

  const calcDataRow = (cur1: string, cur2: string) => {
    const objFirst = dataFirst["rates"];
    const objSecond = dataSecond["rates"];
    const objThird = dataThird["rates"];

    const object: INewObjects = {
      name: `${cur1}/${cur2}`,
      first: (objFirst[cur1] / objFirst[cur2]).toFixed(2),
      second: (objSecond[cur1] / objSecond[cur2]).toFixed(2),
      third: (objThird[cur1] / objThird[cur2]).toFixed(2),
    };

    const min = Math.min(
      Number(object.first),
      Number(object.second),
      Number(object.third)
    );
    return {
      object,
      min,
    };
  };

  useEffect(() => {
    getFirst();
    getSecond();
    getThird();
    if (dataFirst["rates"] && dataSecond["rates"] && dataThird["rates"]) {
      console.log(dataFirst["rates"]);
      const objFirst = dataFirst["rates"];
      const objSecond = dataSecond["rates"];
      const objThird = dataThird["rates"];
      const tempArr = [];
      const minRateTemp: number[] = [];

      for (const name of ratesNames) {
        if (name === "RUB/USD") {
          const dataRow = calcDataRow("RUB", "USD");
          tempArr.push(dataRow.object);
          minRateTemp.push(dataRow.min);
        } else if (name === "RUB/EUR") {
          const dataRow = calcDataRow("RUB", "EUR");
          tempArr.push(dataRow.object);
          minRateTemp.push(dataRow.min);
        } else if (name === "EUR/USD") {
          const dataRow = calcDataRow("EUR", "USD");
          tempArr.push(dataRow.object);
          minRateTemp.push(dataRow.min);
        } else {
          const object = {
            name,
            first: objFirst[`${name.slice(0, 3)}`].toFixed(2),
            second: objSecond[`${name.slice(0, 3)}`].toFixed(2),
            third: objThird[`${name.slice(0, 3)}`].toFixed(2),
          };
          const min = Math.min(
            Number(object.first),
            Number(object.second),
            Number(object.third)
          );
          tempArr.push(object);
          minRateTemp.push(min);
        }
      }
      setNewArray(tempArr);
      setMinRateArr(minRateTemp);
    }
  }, [dataFirst, dataSecond, dataThird]);

  const baseUrl = "http://localhost:3000/api/v1";

  const getFirst = async () => {
    try {
      const response = await fetch(`${baseUrl}/first/poll`);
      const data = await response.json();
      setDataFirst(data);
      await getFirst();
    } catch (e) {
      setTimeout(() => {
        getFirst();
      }, 500);
    }
  };

  const getSecond = async () => {
    try {
      const response = await fetch(`${baseUrl}/second/poll`);
      const data = await response.json();
      setDataSecond(data);
      await getSecond();
    } catch (e) {
      setTimeout(() => {
        getSecond();
      }, 500);
    }
  };

  const getThird = async () => {
    try {
      const response = await fetch(`${baseUrl}/third/poll`);
      const data = await response.json();
      setDataThird(data);
      await getThird();
    } catch (e) {
      setTimeout(() => {
        getThird();
      }, 500);
    }
  };

  if (newArray.length > 0)
    return (
      <div>
        <table style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <thead>
            <tr>
              <th style={{ minWidth: "200px", height: "50px", fontSize: "18px" }}>
                Pair name/market
              </th>
              <th style={{ minWidth: "200px", height: "50px", fontSize: "18px" }}>
                First
              </th>
              <th style={{ minWidth: "200px", height: "50px", fontSize: "18px" }}>
                Second
              </th>
              <th style={{ minWidth: "200px", height: "50px", fontSize: "18px" }}>
                Third
              </th>
            </tr>
          </thead>
          <tbody>
            {newArray.map((item, i) => {
              return (
                <tr key={i}>
                  {Object.values(newArray[i]).map((item2, index2) => {
                    return (
                      <td
                        key={index2}
                        style={{
                          minWidth: "200px",
                          height: "50px",
                          textAlign: "center",
                          border: "1px solid black",
                          background: `${
                            index2 > 0 &&
                            Number(item2) === Number(minRateArr[i]) &&
                            "orange"
                          }`,
                        }}
                      >
                        {item2}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
};

export default MainComponent;
