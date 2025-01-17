#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Crawler for [WuxiaWorld](http://www.wuxiaworld.com/)
"""
import re
import sys
from os import path
from .binding import novel_to_kindle
from .helper import get_browser, save_chapter


class WuxiaCrawler:
    '''Crawler for WuxiaWorld'''

    def __init__(self, novel_id, start_url=None, end_url=None):
        if not novel_id:
            raise Exception('Novel ID is required')
        # end if

        self.novel_id = novel_id
        self.novel_name = 'Unknown'
        self.author_name = 'Unknown'

        self.home_url = 'http://www.wuxiaworld.com/novel/%s' % (novel_id)
        self.start_url = self.get_url_from_chapter(start_url)
        self.end_url = self.get_url_from_chapter(end_url)

        self.output_path = path.join('_novel', novel_id)
    # end def

    def get_url_from_chapter(self, chapter):
        '''get url from chapter number'''
        if not chapter:
            return None
        # end if
        if chapter.isdigit():
            print('\nError: Chapter number is not supported for WuxiaWord at this moment.',
                  'Provide full url of the chapter, e.g.',
                  'https://www.wuxiaworld.com/novel/a-will-eternal/awe-chapter-40\n\n')
            raise Exception('Invalid URL')
        else:
            return chapter.strip('/')
    # end def

    def start(self):
        '''start crawling'''
        browser = get_browser()
        try:
            if self.start_url:
                # self.crawl_meta_info(browser)
                self.crawl_chapters(browser)
            # end if
        finally:
            browser.quit()
        # end try
        novel_to_kindle(self.output_path)
    # end def

    def crawl_meta_info(self, browser):
        '''get novel name and author'''
        print('Visiting:', self.home_url)
        browser.visit(self.home_url)
        self.novel_name = browser.find_by_css('.panel.panel-default h4').first.text
    # end def

    def crawl_chapters(self, browser):
        '''Crawl all chapters till the end'''
        url = self.start_url
        while url:
            print('Visiting:', url)
            browser.visit(url)
            next_link = browser.find_by_css('.top-bar-area .next a')
            if not next_link:
                break
            # end if
            url_new = next_link.first['href'].strip('/#')
            self.parse_chapter(browser)
            if url == url_new or url == self.end_url:
                break
            # end if
            url = url_new
        # end while
    # end def

    def parse_chapter(self, browser):
        '''Parse the content of the chapter page'''
        url = browser.url.strip('/')
        if url.endswith('interlude'):
            return print('Not valid. It is an interlude.')
        # end if
        chapter_no = re.search(r'chapter-\d+', url)
        if not chapter_no:
            return print('No chapter number found!')
        # end if
        chapter_no = chapter_no.group().strip('chapter-')
        vol_no = re.search(r'book-\d+', url)
        if vol_no:
            vol_no = vol_no.group().strip('book-')
        else:
            chapter = re.search(r'\d+', chapter_no).group()
            vol_no = str(1 + (int(chapter) - 1) // 100)
        # end if
        novel_name = browser.find_by_css('.top-bar-area .caption h4').first.text
        chapter_title = browser.find_by_css('.panel-default .caption h4').first.text
        body = [x for x in browser.find_by_css('.panel-default .fr-view p')]
        if re.match(r'(Book \d+)?.*Chapter \d+.*', body[0].text):
            chapter_title = body[0].text
            body = body[1:]
        elif re.match(r'(Book \d+)?.*Chapter \d+.*', body[1].text):
            chapter_title = body[1].text
            body = body[2:]
        # end if
        body = ''.join(['<p>' + x.html + '</p>' for x in body if x.text.strip()])
        # save data
        save_chapter({
            'url': url,
            'novel': novel_name,
            'chapter_no': chapter_no,
            'chapter_title': chapter_title,
            'volume_no': vol_no,
            'body': '<h1>%s</h1>%s' % (chapter_title, body)
        }, self.output_path)
    # end def
# end class

if __name__ == '__main__':
    WuxiaCrawler(
        novel_id=sys.argv[1],
        start_url=sys.argv[2] if len(sys.argv) > 2 else None,
        end_url=sys.argv[3] if len(sys.argv) > 3 else None
    ).start()
# end if
