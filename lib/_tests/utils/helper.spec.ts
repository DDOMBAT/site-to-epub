import { expect, should } from 'chai'
import { parseCookies } from '../..//utils/helper'

should()

describe('Utility: Helper', () => {
  describe('parseCookies', () => {

    it('should handle invalid inputs', () => {
      expect(parseCookies(null)).to.equal(null)
      expect(parseCookies('')).to.equal(null)
      expect(parseCookies('test=')).to.equal(null)
      expect(parseCookies('-932 -2 0; pl ;as dp 0q = ==2 39 up')).to.equal(null)
      expect(parseCookies('-932 -2 0; pl ;as dp 0q = 2 39 up')).to.equal(null)
      expect(parseCookies('as dp 0q = 2 39 up')).to.deep.equal({ 'as dp 0q': '2 39 up' })
      expect(parseCookies('test=3')).to.deep.equal({ 'test': '3' })
      expect(parseCookies('test=3;tt')).to.deep.equal({ 'test': '3' })
      expect(parseCookies('test=3;tt=')).to.deep.equal({ 'test': '3' })
      expect(parseCookies('test=3;tt=;')).to.deep.equal({ 'test': '3' })
    })

    it('should parse webnovel cookies properly', () => {
      const cookie = '_csrfToken=6UbsNkvEc1de69T4eh5VYx3M7rBQvupZM01MpKtD; expires=Wed, 21-Aug-2019 20:21:31 GMT; path=/; domain=.webnovel.com; secure'
      const parsed = parseCookies(cookie)
      expect(parsed).not.equal(null)
      parsed.should.have.keys('_csrfToken')
      parsed['_csrfToken'].should.equal('6UbsNkvEc1de69T4eh5VYx3M7rBQvupZM01MpKtD')
    })

    it('should parse lnmtl cookies properly', () => {
      const cookie = '__cfduid=da48fc97c9ea6147d5534503f5337db821534343165; expires=Thu, 15-Aug-19 14:26:05 GMT; path=/; domain=.foobar.com; HttpOnly, XSRF-TOKEN=eyJpdiI6Imx3TXJFZ013QVRiXC9mUzFMXC9uM2NzQT09IiwidmFsdWUiOiJ5Z2V2SVJRUlpKRmQ0c0xCU0VWUDBGVzduWnBxVlwvaVhVTnlSbzdnTnJkdzlNd0M2KzFDZWVzQ3lZT1N6RkpJdkZuM0w4MkMraE5SWDN1XC9xUmlNNDJRPT0iLCJtYWMiOiI3MmE4YzEwYTY5ZGI5NTIyNWMyZTBmM2Q0YTlhZGE3Mzk2MzYyMmI1NGZiYWFmNjBlMjgxMTZjMzFkOGU3N2UxIn0%3D; expires=Wed, 15-Aug-2018 16:26:05 GMT; Max-Age=7200; path=/, laravel_session=eyJpdiI6Ikp2ckE5ME5KRFU4TlFOc0xxVUZXR2c9PSIsInZhbHVlIjoiRWRcLzRMdFJLMEM2U2dEdTdUN1FcL2w2WGZ5eGJ1VmF2ZHJYd2JoVjUzSHBWQlkzYmIzWWRzUllMcEt0Sjk3OVlaeGRLTWozNFJyVDBPZkxuT3RnVUY2dz09IiwibWFjIjoiYzg1OGY3MGY4NTEzMmJlY2E3MjhlOGM5NTM4ZmY1MjdlYjc4YjIyOTQyODFiYjdlNDcyMzY3NTQzNGRkYTU3MiJ9; expires=Wed, 15-Aug-2018 16:26:05 GMT; Max-Age=7200; path=/; httponly'
      const parsed = parseCookies(cookie)
      expect(parsed).not.equal(null)
      parsed.should.have.keys('__cfduid', 'XSRF-TOKEN', 'laravel_session')
      parsed['__cfduid'].should.equal('da48fc97c9ea6147d5534503f5337db821534343165')
      parsed['XSRF-TOKEN'].should.equal('eyJpdiI6Imx3TXJFZ013QVRiXC9mUzFMXC9uM2NzQT09IiwidmFsdWUiOiJ5Z2V2SVJRUlpKRmQ0c0xCU0VWUDBGVzduWnBxVlwvaVhVTnlSbzdnTnJkdzlNd0M2KzFDZWVzQ3lZT1N6RkpJdkZuM0w4MkMraE5SWDN1XC9xUmlNNDJRPT0iLCJtYWMiOiI3MmE4YzEwYTY5ZGI5NTIyNWMyZTBmM2Q0YTlhZGE3Mzk2MzYyMmI1NGZiYWFmNjBlMjgxMTZjMzFkOGU3N2UxIn0%3D')
      parsed['laravel_session'].should.equal('eyJpdiI6Ikp2ckE5ME5KRFU4TlFOc0xxVUZXR2c9PSIsInZhbHVlIjoiRWRcLzRMdFJLMEM2U2dEdTdUN1FcL2w2WGZ5eGJ1VmF2ZHJYd2JoVjUzSHBWQlkzYmIzWWRzUllMcEt0Sjk3OVlaeGRLTWozNFJyVDBPZkxuT3RnVUY2dz09IiwibWFjIjoiYzg1OGY3MGY4NTEzMmJlY2E3MjhlOGM5NTM4ZmY1MjdlYjc4YjIyOTQyODFiYjdlNDcyMzY3NTQzNGRkYTU3MiJ9')
    })

  })
})
