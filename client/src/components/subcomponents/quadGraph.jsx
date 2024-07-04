import { LineChart, Line, XAxis, YAxis } from 'recharts';
import { useRef, useEffect } from 'react';

const QuadGraph = ({data}) => {

  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);


  return (
    <LineChart width={290} height={250} data={dataRef.current}>
      <Line type="monotone" dataKey="x" stroke="#8884d8" />
      <Line type="monotone" dataKey="y" stroke="#ff13ff" />
      <Line type="monotone" dataKey="z" stroke="#0e7aff" />
      <Line type="monotone" dataKey="net" stroke="#ffffff" />

      <XAxis dataKey="t" interval={50}/>
      <YAxis domain={['auto', 'auto']}/>
    </LineChart>
  );
}

export default QuadGraph;