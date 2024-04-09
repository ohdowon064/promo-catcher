import axios from 'axios'
import * as cheerio from 'cheerio'
import {NextApiRequest, NextApiResponse} from "next";

interface CrawlData {
  title: string;
  link: string;
  imageUrl: string;
  deadline: string;
  total: number;
  current: number;
}

interface Error {
  message: string;
  error: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CrawlData[] | Error>) {
  const targetUrl = 'https://www.tojobcn.com/bbs/board.php?bo_table=blog_go&sca=%EC%84%9C%EC%9A%B8&page=1';
  const regex = /(\d+)/;
  try {
    console.log('api 호출됨')
    const {data} = await axios.get(targetUrl);
    const $ = cheerio.load(data);
    const result: CrawlData[] = [];

    $('div.list-item').each((index, element) => {
      const totalText = $(element).find('.contents > span:nth-of-type(2)').text().trim();
      const total = parseInt(totalText.match(regex)?.[0] || '0');
      const currentText = $(element).find('.contents > span:nth-of-type(1)').text().trim();
      const current = parseInt(currentText.match(regex)?.[0] || '0');
      result.push({
        title: $(element).find('h2 > span:nth-of-type(2)').text().trim(),
        link: $(element).find('.img-item > a').attr('href') || '',
        imageUrl: $(element).find('.img-item img').attr('src') || '',
        deadline: $(element).find('.label-cap_front').text().trim(),
        total: total,
        current: current,
      })
    })
    console.log(result)
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: "크롤링 중 에러 발생", error: error instanceof Error ? error.message : null});
  }
}

