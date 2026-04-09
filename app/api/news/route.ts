import { NextResponse } from "next/server";
import Parser from "rss-parser";
import * as cheerio from "cheerio"; // 💡 HTML 파서 임포트

const parser = new Parser({
  customFields: {
    item: ["source"],
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "검색어가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    // 1. 구글 뉴스 RSS 가져오기
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}`;
    const feed = await parser.parseURL(feedUrl);

    // 딱 8개만 자릅니다. (많이 긁어올수록 속도가 느려집니다)
    const topItems = feed.items.slice(0, 8);

    // 💡 2. 8개의 기사 링크를 동시에 방문하여 og:image(썸네일) 추출!
    const articles = await Promise.all(
      topItems.map(async (item) => {
        let thumbnail = null;

        try {
          // 뉴스 원문 사이트로 요청을 보냅니다.
          // (언론사 서버가 봇을 차단하지 않도록 User-Agent를 사람 브라우저처럼 위장)
          const response = await fetch(item.link!, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            next: { revalidate: 3600 }, // Next.js 캐싱 (성능 향상)
          });

          // HTML을 텍스트로 받아와서 cheerio로 파싱합니다.
          const html = await response.text();
          const $ = cheerio.load(html);

          // 💡 <meta property="og:image" content="..."> 태그의 content(이미지 주소)를 찾습니다.
          thumbnail = $('meta[property="og:image"]').attr("content") || null;
        } catch (e) {
          // 특정 언론사 서버가 닫혀있거나 에러가 나도, 전체 뉴스가 깨지지 않도록 조용히 넘깁니다.
          console.log(`[크롤링 실패] ${item.source}: 썸네일 생략`);
        }

        return {
          id: item.guid || item.link,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: item.source,
          thumbnail: thumbnail, // 추출한 썸네일 (실패시 null)
        };
      }),
    );

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("News Fetch Error:", error);
    return NextResponse.json(
      { error: "뉴스를 불러오는데 실패했습니다." },
      { status: 500 },
    );
  }
}
