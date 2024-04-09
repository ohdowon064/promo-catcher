// pages/crawlTable.tsx
import { useEffect, useState } from 'react';
import Link from "next/link";

interface CrawlData {
  title: string;
  link: string;
  imageUrl: string;
  deadline: string;
  total: number;
  current: number;
}

const CrawlTable = () => {
  const [data, setData] = useState<CrawlData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/crawl');
      const jsonData: CrawlData[] = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Crawled Data Table</h2>
      <table border={1}>
        <thead>
        <tr>
          <th>Title</th>
          <th>Image</th>
          <th>Deadline</th>
          <th>모집 인원</th>
          <th>지원자</th>
          <th>남은 인원</th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
          <tr key={index} style={{textAlign: "center", backgroundColor: item.deadline === "마감" ? "lightgrey" : "inherit"}}>
            <td onClick={()=>window.open(item.link, '_blank')} style={{cursor: 'pointer'}}>{item.title}</td>
            <td><img src={item.imageUrl} alt="Company Logo" style={{width: '100px'}}/></td>
            <td>{item.deadline}</td>
            <td>{item.total}</td>
            <td>{item.current}</td>
            <td>{item.total - item.current}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrawlTable;
