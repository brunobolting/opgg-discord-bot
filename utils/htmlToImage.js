const puppeteer = require("puppeteer")

async function htmlToImage(tag = "body", html = "") {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setContent(html)

    const content = await page.$(tag)
    if (content === null) {
        return null;
    }
	const imageBuffer = await content.screenshot({ omitBackground: false })

	await page.close()
	await browser.close()

	return imageBuffer
}

module.exports = htmlToImage
