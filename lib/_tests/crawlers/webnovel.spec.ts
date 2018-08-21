import { expect, should } from 'chai'
import { TestAgent } from '../../utils/agent'
import { Webnovel } from '../../crawlers/webnovel'
import { Response, RequestInit } from 'node-fetch'

should()

describe('Crawlers', () => {
  describe('Webnovel', () => {

    it('should create an instance with default name', () => {
      const crawler = new Webnovel()
      expect(crawler.name).to.equal('Webnovel Crawler')
    })

    it('should detect novel id from links', () => {
      const crawler = new Webnovel()
      crawler.getNovelId('https://www.webnovel.com/book/6838665602002305').should.equal('6838665602002305')
      crawler.getNovelId('https://www.webnovel.com/book/6838665602002305/God-Of-Slaughter').should.equal('6838665602002305')
      crawler.getNovelId('https://www.webnovel.com/book/7931338406001705/21417334738783820/Release-That-Witch/Flame').should.equal('7931338406001705')
      crawler.getNovelId('https://www.webnovel.com/book/7931338406001705/21417334738783820').should.equal('7931338406001705')
      crawler.getNovelId('https://www.webnovel.com/book/10379480606024005/World-Of-Monsters').should.equal('10379480606024005')

      crawler.getNovelId('http://www.webnovel.com/book/10379480606024005').should.equal('10379480606024005')
      crawler.getNovelId('http://www.webnovel.com/book/10379480606024005/').should.equal('10379480606024005')
      crawler.getNovelId('http://www.webnovel.com/book/10379480606024005/World-Of-Monsters').should.equal('10379480606024005')

      crawler.getNovelId('www.webnovel.com/book/10379480606024005').should.equal('10379480606024005')
      crawler.getNovelId('www.webnovel.com/book/6838665602002305/').should.equal('6838665602002305')

      crawler.getNovelId('www.webnovel.com 10379480606024005').should.equal('10379480606024005')

      crawler.getNovelId('10379480606024005').should.equal('10379480606024005')
      crawler.getNovelId('6838665602002305').should.equal('6838665602002305')
    })

    it('should reject non-crawlable links', () => {
      const crawler = new Webnovel()
      crawler.canCrawl('https://www.webnovel.com/profile/548730406').should.equal(false)
      crawler.canCrawl('https://www.webnovel.com/category/list?category=0&orderBy=2&bookType=0').should.equal(false)
      crawler.canCrawl('https://www.webnovel.com/book/809399080500420').should.equal(false)

      crawler.canCrawl('http://www.webnovel.com/book/1037948/0606024005').should.equal(false)
      crawler.canCrawl('http://www.webnovel.com/book/103794806060240/').should.equal(false)
      crawler.canCrawl('379480606024005/World-Of-Monsters').should.equal(false)

      crawler.canCrawl('www.webnovel.com/book/1037948060.6024005').should.equal(false)
      crawler.canCrawl('www.webnovel.com/book/683866560200230 5/').should.equal(false)

      crawler.canCrawl('www.webnovel.com 1037948060602..').should.equal(false)

      crawler.canCrawl('a037948060602400a').should.equal(false)
      crawler.canCrawl('548730406').should.equal(false)
    })

    it('should get a translated novel info', async () => {
      const crawler = new Webnovel(new TestAgent((url: string, init?: RequestInit) => {
        const response = new Response()
        response.headers.set('set-cookie', '_csrfToken=6UbsNkvEc1de69T4eh5VYx3M7rBQvupZM01MpKtD; expires=Wed, 21-Aug-2019 20:21:31 GMT; path=/; domain=.webnovel.com; secure')
        response.json = () => new Promise(resolve => resolve(JSON.parse(`{
          "code":0,
          "data":{
            "bookInfo":{
              "bookName":"The Mech Touch"
            },
            "volumeItems":[{
              "name":"The Novice Mech Designer",
              "index":1,
              "chapterItems":[
                {"id":"28551667062461575","name":"Age of Mechs","index":1},
                {"id":"28556134382099460","name":"Mech Designer System","index":2}
              ]
            },{
              "name":"Calm Before The Storm",
              "index":2,
              "chapterCount":2,
              "chapterItems":[
                {"id":"30781096538990117","name":"Advancement","index":106},
                {"id":"30818079982273309","name":"Injection","index":107}
              ]
            }]
          },
          "msg":"Success"
        }`)))
        return response
      }))
      const novel = await crawler.getNovel('6838665602002305')
      expect(novel.id).to.equal('6838665602002305')
    })
  })
})