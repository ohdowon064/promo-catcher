import axios from 'axios'
import * as cheerio from 'cheerio'
import {NextApiRequest, NextApiResponse} from "next";

interface CrawlData {
  imageUrl: string;
  deadline: string;
  company: string;
  recruitmentStatus: string;
  applicants: string;
}

interface Error {
  message: string;
  error: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CrawlData[] | Error>) {
  const targetUrl = 'https://www.tojobcn.com/bbs/board.php?bo_table=blog_go&sca=%EC%84%9C%EC%9A%B8&page=1';
  try {
    const {data} = await axios.get(targetUrl);
    const $ = cheerio.load(data);
    const result: CrawlData[] = [];

    $('list-item').each((index, element) => {
      result.push({
        imageUrl: $(element).find('.img-item img').attr('src') || '',
        deadline: $(element).find('.label-cap_front').text().trim(),
        company: $(element).find('.pull-right').last().text().trim(),
        recruitmentStatus: $(element).find('span.pull-right span').last().prev().text().trim(), // 모집 상태
        applicants: $(element).find('.contents .padding span').first().text().trim() + $('.contents .padding span').last().text().trim(),
      })
    })
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message: "크롤링 중 에러 발생", error: error instanceof Error ? error.message : null});
  }
}

