const axios = require('axios')
const cheerio = require('cheerio')
const opggUrl = process.env.OPGG_URL
const opggApiUrl = process.env.OPGG_API_URL
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
        const $ = await this.GetChampionPage(champion, position)
        if ($ === null) {
            return null
        }
        const spellsImageBuffer = await htmlToImage(".main > :nth-child(1)", $.html())
        if (spellsImageBuffer === null) {
            return null
        }
        return spellsImageBuffer
    }

    async GetChampionBuildsAsImage(champion, position) {
        const $ = await this.GetChampionPage(champion, position)
        if ($ === null) {
            return null
        }
        const buildsImageBuffer = await htmlToImage(".main > :nth-child(2)", $.html())
        if (buildsImageBuffer === null) {
            return null
        }
        return buildsImageBuffer
    }

    async GetChampionRunesAsImage(champion, position) {
        const $ = await this.GetChampionPage(champion, position)
        if ($ === null) {
            return null
        }
        const runesImageBuffer = await htmlToImage(".main > :nth-child(3)", $.html())
        if (runesImageBuffer === null) {
            return null
        }
        return runesImageBuffer
    }

    async GetChampionAsImage(champion, position) {
        const $ = this.GetChampionPage(champion, position)
        if ($ === null) {
            return null
        }
        const spellsImageBuffer = await htmlToImage(".main > :nth-child(1)", $.html())
        const buildsImageBuffer = await htmlToImage(".main > :nth-child(2)", $.html())
        const runesImageBuffer = await htmlToImage(".main > :nth-child(3)", $.html())
        return {spells: spellsImageBuffer, builds: buildsImageBuffer, runes: runesImageBuffer}
    }

    async GetChampion(champion, position) {
        const token = await this.getOpggToken()
        const url = `${opggUrl}/_next/data/${token}/champions/${champion}/${position}/build.json`

        const data = await axios.get(
            url, {
            params: {
                champion,
                position,
                hl: 'pt_BR'
            }
        })

        return data.data.pageProps.data
    }

    async GetChampionPage(champion, position) {
        if (! await this.ChampionExists(champion, position)) {
            return null
        }
        const url = `${opggUrl}/champions/${champion}/${position}/build`
        const page = await this.getOpgg(url)
        return cheerio.load(page)
    }

    async ChampionExists(champion, position) {
        const url = `${opggApiUrl}/champions/ranked/${champion}/${position}`

        const data = await axios.get(url).catch((err) => err)

        return !(data instanceof Error)
    }
}

module.exports = Opgg
