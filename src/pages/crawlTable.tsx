// pages/crawlTable.tsx
import { useEffect, useState } from 'react';
import Link from "next/link";
import {CrawlRawData} from "@/pages/api/crawl";

interface CrawlData {
  title: string;
  link: string;
  imageUrl: string;
  deadline: number;
  total: number;
  current: number;
  remaining: number;
  competitionRate: string;
}

const CrawlTable = () => {
  const [data, setData] = useState<CrawlData[]>([]);
  const [filteredData, setFilteredData] = useState<CrawlData[]>([]);
  const [sortBy, setSortBy] = useState<string>(''); // 추가: 정렬 기준

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/crawl');
      const jsonData: CrawlRawData[] = await response.json();
      setData(jsonData.map(item => ({...item, deadline: parseDeadline(item.deadline), remaining: item.total - item.current, competitionRate: (item.current / item.total).toFixed(2)})));
    };

    fetchData();
  }, []);

  const parseDeadline = (deadline: string) => {
    if (deadline.startsWith('D-')) {
      return parseInt(deadline.slice(2), 10);
    } else if (deadline === '당일 마감') {
      return 0;
    } else {
      return -1;
    }
  }

  const handleSort = (key: keyof CrawlData) => {
    setSortBy(key);
    const sorted = [...filteredData].sort((a, b) => {
      if (key === 'deadline') {
        // 마감 날짜의 경우 특별한 처리
        if (a[key] === '마감') return 1;
        if (b[key] === '마감') return -1;
      }
      return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
    });
    setFilteredData(sorted);
  };

  const getDeadlineDate = (deadline: number) => {
    const today = new Date();
    if(deadline > 0){
      today.setDate(today.getDate() + deadline);
      return toFormat(today); // YYYY-MM-DD 형식으로 변환
    } else if(deadline === 0) {
      return toFormat(today);
    } else {
      return "";
    }
  }
  const weekday = ['일', '월', '화', '수', '목', '금', '토'];
  const toFormat = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dayOfWeek = weekday[date.getDay()];
    return `${year}.${month}.${day}(${dayOfWeek})`;
  }


  return (
    <div>
      <h2>Crawled Data Table</h2>
      <table style={{width: '100%', borderCollapse: 'collapse'}} border={1}>
        <style>
          {`
            thead {
                position: sticky;
                top: 0;
                background-color: white;
                z-index: 1;
                height: 50px; /* 헤더의 높이를 늘립니다 */
            }
            th, td {
                padding: 10px; /* 셀의 패딩을 조정합니다 */
                text-align: center;
                border: 1px solid black;
            }
            td {
                position: relative; /* 이미지와 확대된 이미지를 포지셔닝하기 위해 상대 위치 설정합니다 */
            }
             .thumbnail {
                  max-width: 100%; /* 이미지의 최대 너비를 지정합니다 */
                  height: auto;
                  transition: transform 0.3s ease; /* 변환 효과를 추가하여 부드러운 확대 효과를 만듭니다 */
              }
              .zoomed-image {
                  display: none; /* 확대된 이미지는 초기에는 숨겨둡니다 */
                  position: absolute; /* 부모 요소를 기준으로 절대 위치로 설정합니다 */
                  top: -50%; /* 원본 이미지 아래에 배치됩니다 */
                  left: 50%; /* 가운데 정렬을 위해 왼쪽을 50%로 설정합니다 */
                  transform: translateX(-50%); /* 가운데 정렬을 위해 X축으로 -50%만큼 이동합니다 */
                  z-index: 2; /* 원본 이미지보다 위에 표시됩니다 */
              }
              td:hover .zoomed-image {
                  display: block; /* 이미지 위에 호버할 때 확대된 이미지가 표시됩니다 */
              }
            .competition-rate {
                width: 100px; /* 경쟁률 열의 너비를 조정합니다 */
            }
          `}
        </style>
        <thead>
        <tr>
          <th>Title</th>
          <th>Image</th>
          <th>마감 날짜</th>
          <th>모집 인원</th>
          <th>지원자</th>
          <th>남은 인원</th>
          <th>경쟁률</th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
          <tr key={index}
              style={{
                textAlign: "center",
                backgroundColor: item.deadline === -1 ? "lightgrey" : item.deadline === 0 ? "lightcyan" : 'inherit'
              }}>
            <td>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration: "none"}}>{item.title}</a>
            </td>
            <td>
              <img src={item.imageUrl} alt="Company Logo" className='thumbnail' style={{maxWidth: '150px', height: 'auto'}}/>
              <img src={item.imageUrl} alt="Company Logo" className='zoomed-image'/>
            </td>
            <td>{item.deadline > 0 ? `D-${item.deadline}` : item.deadline === 0 ? '오늘 마감' : '마감'}<br></br>{getDeadlineDate(item.deadline)}
            </td>
            <td>{item.total}</td>
            <td>{item.current}</td>
            <td>{item.remaining}</td>
            <td className="competition-rate">{item.competitionRate} : 1</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrawlTable;
