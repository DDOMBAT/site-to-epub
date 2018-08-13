#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Contains methods for binding novel or manga into epub and mobi"""
import re
import io
import os
import json
import errno
import random
import textwrap
import platform
from subprocess import call
from ebooklib import epub
from PIL import Image, ImageFont, ImageDraw

DIR_NAME = os.path.dirname(os.path.abspath(__file__))
KINDLEGEN_PATH_MAC = os.path.join(DIR_NAME, 'ext', 'kindlegen-mac')
KINDLEGEN_PATH_LINUX = os.path.join(DIR_NAME, 'ext', 'kindlegen-linux')
KINDLEGEN_PATH_WINDOWS = os.path.join(DIR_NAME, 'ext', 'kindlegen-windows')
SYSTEM_OS = platform.system()


def get_epub_file(book_title, volume_no):
    '''returns the epub output file'''
    output_path = os.path.join(book_title, 'epub')
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    # end if
    file_name = book_title + '_v' + volume_no + '.epub'
    file_path = os.path.join(output_path, file_name)
    return file_path
# end def

def get_mobi_file(book_title, volume_no):
    '''returns the epub output file'''
    output_path = os.path.join(book_title, 'mobi')
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    # end if
    file_name = book_title + '_v' + volume_no + '.mobi'
    file_path = os.path.join(output_path, file_name)
    return file_path
# end def

def get_text_file(book_title, volume_no, chapter_no):
    '''returns the epub output file'''
    output_path = os.path.join(book_title, 'text')
    output_path = os.path.join(output_path, book_title + '_v' + volume_no)
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    # end if
    file_name = chapter_no + '.txt'
    file_path = os.path.join(output_path, file_name)
    return file_path
# end def

def novel_to_kindle(input_path):
    ''''Convert novel to epub'''
    if not os.path.exists(input_path):
        return print(input_path, 'does not exists')
    # end if
    novel_id = os.path.basename(input_path)
    # Create epubs by volumes
    for volume_no in sorted(os.listdir(input_path)):
        full_vol = os.path.join(input_path, volume_no)
        if not os.path.isdir(full_vol):
            continue
        # end if
        try:
            # create book
            book = epub.EpubBook()
            book.set_identifier(novel_id + volume_no)
            book.set_language('en')
            # get chapters
            contents = []
            book_title = None
            book_author = None
            vol = volume_no.rjust(2, '0')
            print('Processing:', full_vol)
            for file_name in sorted(os.listdir(full_vol)):
                # read data
                full_file = os.path.join(full_vol, file_name)
                item = json.load(open(full_file, 'r'))
                # add chapter
                xhtml_file = 'chap_%s.xhtml' % item['chapter_no'].rjust(4, '0')
                chapter = epub.EpubHtml(
                    lang='en',
                    file_name=xhtml_file,
                    uid=item['chapter_no'],
                    content=item['body'] or '',
                    title=item['chapter_title'])
                book.add_item(chapter)
                contents.append(chapter)
                if not book_title: book_title = item['novel']
                if not book_author and 'author' in item: book_author = item['author']
            # end for
            book_title = book_title or 'Unknown'
            book_author = book_author or 'Unknown'
            book.spine = ['nav'] + contents
            book.add_author(book_author)
            book.set_title(book_title + ' Volume ' + vol)
            book.toc = contents
            book.add_item(epub.EpubNav())
            book.add_item(epub.EpubNcx())
            # Create epub file
            book_title = re.sub('[\\\\/*?:"<>|]' or r'[\\/*?:"<>|]',"", book_title)
            epub_path = get_epub_file(book_title, volume_no)
            print('Creating:', epub_path)
            epub.write_epub(epub_path, book, {})
            # convert epub to mobi
            mobi_path = get_mobi_file(book_title, volume_no)
            epub_to_mobi(epub_path, mobi_path)
        except:
            pass
        # end try
    # end for
# end def

def epub_to_mobi(epub_file, mobi_file):
    ''''Convert epub to mobi'''
    if not epub_file.endswith('.epub'):
        return
    # end if
    # Mobi file generator
    generator = lambda gen: call([gen, '-c2', epub_file])
    # Try using system kindlegen
    try:
        return generator('kindlegen')
    except (OSError, Exception) as err:
        if err[1].errno == errno.ENOENT:
            print("Warning: kindlegen was not on your path; not generating .mobi version")
            print("Visit https://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000765211 to install it.")
        # end if
        pass
    # end try
    # Use local kindlegen
    if SYSTEM_OS == 'Linux':
        return generator(KINDLEGEN_PATH_LINUX)
    elif SYSTEM_OS == 'Darwin':
        return generator(KINDLEGEN_PATH_MAC)
    elif SYSTEM_OS == 'Windows':
        return generator(KINDLEGEN_PATH_WINDOWS)
    else:
        print("Warning: kindlegen does not support your OS; not generating .mobi version")
        print("Visit https://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000765211 to install it.")
    # end if
# end def


def manga_to_kindle(input_path):
    '''Convert crawled data to epub'''
    manga_id = os.path.basename(input_path)
    output_path = manga_id
    name = ' '.join([x.capitalize() for x in manga_id.split('_')])
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    # end if
    call(['kcc-c2e',
          '-p', 'KPW',
          # '--forcecolor',
          # '-f', 'EPUB',
          '-t', name,
          '-o', output_path,
          input_path])
# end def
