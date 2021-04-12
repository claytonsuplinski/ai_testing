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

def contains_alphanumeric( s ):
    return re.search( '[a-zA-Z0-9]', s )

def remove_all_html( content ):
    return re.sub( '<[^>]+>', '', content )

def remove_html_tags( content, tags ):
    for tag in tags:
        content = re.sub( r'<[ ]*{0}.*?\/[ ]*{0}[ ]*>'.format( tag ), '', content, flags=(re.IGNORECASE | re.MULTILINE | re.DOTALL) )
    return content

def extract_webpage_content( content ):
    lines = remove_all_html(
        remove_html_tags(
            content,
            [ 'footer', 'head', 'nav', 'script', 'style', 'sup', 'video' ]
        )
    ).split('\n')
    lines = [ x.strip() for x in lines ]
    lines = [ x for x in lines if not x.isspace() and len( x ) and contains_alphanumeric( x ) ]
    return lines

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

    return content, links

######################
# Process Dictionary #
######################

URL = 'https://en.wikipedia.org/wiki/Kingdom_Hearts_(video_game)'
content, links = retrieve_webpage( URL )

print( '---- CONTENT ----' )
for line in content:
    print( line )

# print( '---- LINKS ----' )
# for link in links:
#     print( '---------------' )
#     print( 'text : ', link[ 'text' ] )
#     print( 'href : ', link[ 'href' ] )

print( 'Num content lines : ', len( content ) )
print( 'Num links : ', len( links ) )