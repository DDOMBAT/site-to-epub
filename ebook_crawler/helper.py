#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Helper methods used in crawling"""
import json
from os import path, makedirs


def save_metafile(output_path, content):
    '''write meta informations'''
    if not path.exists(output_path):
        makedirs(output_path)
    # end if
    file_name = path.join(output_path, 'meta.json')
    print('Writing ', file_name)
    with open(file_name, 'w') as file:
        file.write(json.dumps(content))
    # end with
# end def


def save_chapter(output_path, content):
    '''save content to file'''
    vol = content['volume_no'].rjust(2, '0')
    chap = content['chapter_no'].rjust(5, '0')
    dir_name = path.join(output_path, vol)
    try:
        makedirs(dir_name)
    except:
        pass
    # end try
    file_name = path.join(dir_name, chap + '.json')
    print('Writing ', file_name)
    with open(file_name, 'w') as file:
        file.write(json.dumps(content))
    # end with
# end def
