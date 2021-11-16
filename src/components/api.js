import { useState, useEffect } from "react";

function useFetch(url, dependencies) {
  // const [fetchUrl, setFetchUrl] = useState("");
  const [data, setData] = useState([]);
  const [dataName, setDataName] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  useEffect(() => {
    async function getData() {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      setDataName(data.map((datum) => datum.show.name));
      setLoaded(true);
    }
    getData();
  }, [url]);
  return [data, isLoaded, dataName];
}

export default useFetch;
