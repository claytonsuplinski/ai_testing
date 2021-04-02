import urllib.request
import sys
import os
import re

####################
# Global Variables #
####################

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

DATA_DIR = '{0}/../data'.format( BASE_DIR )

OUTPUT_FILE = '{0}/formatted_dictionary.json'.format( DATA_DIR )

POS = {
    "a."      : "j",
    "adj"     : "j",
    "adv"     : "a",
    "adv."    : "a",
    "conj."   : "c",
    "interj." : "i",
    "n."      : "n",
    "noun"    : "n",
    "p."      : "s",  # "p." == past (I think?)
    "prep."   : "p",
    "pron."   : "o",
    "v."      : "v",
    "verb"    : "v"
}

####################
# Helper Functions #
####################

def extract_href( html ):
    try:
        return re.search( 'href="(.*?)"', html ).group(1)
    except:
        0
    return False

def extract_link_text( html ):
    try:
        return re.search( '>(.*?)</', html ).group(1)
    except:
        0
    return False

def is_ascii( s ):
    return all( ord(c) < 128 for c in s )

def remove_html_tags( content, tags ):
    for tag in tags:
        content = re.sub( '<{0}.*?\/{0}>'.format( tag ), '', content )
    return content

def extract_webpage_content( content ):
    return remove_html_tags(
        content,
        [ 'head', 'script', 'style', 'video' ]
    )

def extract_webpage_links( content ):
    links = []
    for link_str in re.findall( '<a .*?\/a>', content ):
        link = {
            "href" : extract_href( link_str ),
            "text" : extract_link_text( link_str )
        }
        if link[ 'href' ] and link[ 'text' ]:
            if link[ 'href' ][ 0 ] == '#'     : continue
            if not is_ascii( link[ 'text' ] ) : continue
            links.append( link )
    return links

def retrieve_webpage( url ):
    req     = urllib.request.urlopen( url )
    content = req.read().decode( "utf8" )
    req.close()
    links   = extract_webpage_links(   content )
    content = extract_webpage_content( content )
    print( '---- LINKS ----' )
    for link in links:
        print( '---------------' )
        print( 'text : ', link[ 'text' ] )
        print( 'href : ', link[ 'href' ] )
    print( 'Num links : ', len( links ) )
    return content

######################
# Process Dictionary #
######################

URL = 'https://en.wikipedia.org/wiki/Kingdom_Hearts_(video_game)'
retrieve_webpage( URL )
