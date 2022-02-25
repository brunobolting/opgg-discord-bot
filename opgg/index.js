const axios = require('axios')
const cheerio = require('cheerio')
const opggUrl = 'https://br.op.gg'
const htmlToImage = require('../utils/htmlToImage')

class Opgg {
    async getOpgg (url) {
        const data = await axios.get(url)

        return data.data
    }

    async getOpggToken() {
        const opgg = await this.getOpgg(opggUrl)

        const $ = cheerio.load(opgg)
        const info = $('#__NEXT_DATA__').html()
        const json = JSON.parse(info)

        return json.buildId
    }

    async GetChampionSpellsAsImage(champion, position) {
        const url = `${opggUrl}/champions/${champion}/${position}/build`
        const page = await this.getOpgg(url)
        const $ = cheerio.load(page)
        const spellsImageBuffer = await htmlToImage(".main > :nth-child(1)", $.html());
        return spellsImageBuffer
    }

    async GetChampionBuildsAsImage(champion, position) {
        const url = `${opggUrl}/champions/${champion}/${position}/build`
        const page = await this.getOpgg(url)
        const $ = cheerio.load(page)
        const buildsImageBuffer = await htmlToImage(".main > :nth-child(2)", $.html());
        return buildsImageBuffer
    }

    async GetChampionRunesAsImage(champion, position) {
        const url = `${opggUrl}/champions/${champion}/${position}/build`
        const page = await this.getOpgg(url)
        const $ = cheerio.load(page)
        const runesImageBuffer = await htmlToImage(".main > :nth-child(3)", $.html());
        return runesImageBuffer
    }

    async GetChampionAsImage(champion, position) {
        const url = `${opggUrl}/champions/${champion}/${position}/build`
        const page = await this.getOpgg(url)
        const $ = cheerio.load(page)
        const spellsImageBuffer = await htmlToImage(".main > :nth-child(1)", $.html());
        const buildsImageBuffer = await htmlToImage(".main > :nth-child(2)", $.html());
        const runesImageBuffer = await htmlToImage(".main > :nth-child(3)", $.html());
        return {spells: spellsImageBuffer, builds: buildsImageBuffer, runes: runesImageBuffer}
    }

    async GetChampion(champion, position) {
        const token = await this.getOpggToken()
        const url = `${opggUrl}/_next/data/${token}/champions/${champion}/${position}/build.json`

        const data = await this.get(
            url, {
            params: {
                champion,
                position,
                hl: 'pt_BR'
            }
        })

        return data.pageProps.data
    }

    async get(url, params) {
        const data = await axios.get(url, params)
        return data.data
    }
}

module.exports = Opgg
