import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const pageURLs: string[] = [
    'https://www.understandingwar.org/backgrounder/ukraine-conflict-updates-2022',
    'https://www.understandingwar.org/backgrounder/ukraine-conflict-updates',
];

async function extractReportURLs(sourceURLs: string[]): Promise<string[]> {
    const resArr: string[] = [];

    await Promise.all(
        sourceURLs.map(async (url: string) => {
            const docRes = await axios.get(url);
            const $ = cheerio.load(docRes.data);
            const pageAnchors = $('a').toArray();

            const filteredAnchors = pageAnchors.reduce((filtered: string[], anchor) => {
                if ($(anchor).text().startsWith('Russian Offensive Campaign Assessment')) {
                    filtered.push($(anchor).attr('href')!);
                }
                return filtered;
            }, []);
            resArr.push(...filteredAnchors);
        })
    );

    return resArr;
}

function filterContent(content: string): string {
    return content
        .replace(/(\[\d*])/g, '')
        .replace(/(http.*)/g, '')
        .replace(/(Click here.*?\.)/g, '')
        .replace(/(Satellite image ©2022 Maxar Technologies[.]?)/g, '')
        .replace(/\n/g, '')
        .trim();
}

interface Report {
    date: Date;
    content: string;
}

async function processReport(url: string): Promise<Report | undefined> {
	const checkedUrl = url.startsWith('http') ? url : `http://${url}`
    try {
		const docRes = await axios.get(checkedUrl);
		const $ = cheerio.load(docRes.data);
		
		const rawDate = $("span[property='dc:date dc:created']").attr('content');
		let rawContent = $('.field-name-body').text();
		rawContent = rawContent.split('\n').slice(2).join();
		const processedContent = filterContent(rawContent);
		
		console.log(`Report for date ${new Date(rawDate!).toDateString()} processed; (${url})`);
		if (!rawDate) return undefined;
		return {
			date: new Date(rawDate),
			content: processedContent,
		};
	} catch (err) {
		console.log(`Failed to load ${url}`)
	}
}

async function main() {
    const reports: (Report | undefined)[] = [];
    const reportURLs = await extractReportURLs(pageURLs);

    await Promise.all(
        reportURLs.map(async (reportURL: string) => {
            const processedReport = await processReport(reportURL);
            reports.push(processedReport);
        })
    );

    console.log(reports.length)

    reports.sort((rep1, rep2) => {
        return (rep1?.date as Date).getDate() - (rep2?.date as Date).getDate();
    });

    fs.writeFile('../../../data/reports.json', JSON.stringify(reports, null, 4), (err) => {
        if (err) {
            console.error(err);
        }
    });
}

main().then(()=> {
    console.log("Done!")
});