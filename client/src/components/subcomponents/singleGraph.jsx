import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { useRef, useEffect } from 'react';

const SingleGraph = ({data}) => {

  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);


  return (
    <LineChart width={290} height={250} data={dataRef.current}>
      <Line type="monotone" dataKey="value" stroke="#8884d8" />

      <XAxis dataKey="t" interval={50}/>
      <YAxis domain={['auto', 'auto']}/>
    </LineChart>
  );
}

export default SingleGraph;