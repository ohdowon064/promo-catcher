// pages/crawlTable.tsx
import { useEffect, useState } from 'react';

interface CrawlData {
  imageUrl: string;
  deadline: string;
  company: string;
  recruitmentStatus: string;
  applicants: string;
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
      <table>
        <thead>
        <tr>
          <th>Image</th>
          <th>Deadline</th>
          <th>Company</th>
          <th>Status</th>
          <th>Applicants</th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td><img src={item.imageUrl} alt="Company Logo" style={{ width: '100px' }} /></td>
            <td>{item.deadline}</td>
            <td>{item.company}</td>
            <td>{item.recruitmentStatus}</td>
            <td>{item.applicants}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrawlTable;
