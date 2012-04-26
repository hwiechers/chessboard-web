# Downloads an image in svg format for each chess pieces
import re
import urllib.request

from html.parser import HTMLParser

PIECES = 'rnbkqp'
COLORS = 'ld'
URL_TEMPLATE = 'http://commons.wikimedia.org/wiki/File:Chess_{}t45.svg'

def get_request(url):
    request = urllib.request.Request(url)
    request.add_header('User-Agent',
        'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) ' 
        'Gecko/20120413 Firefox/13.0a2')
    return request

def get_file_bytes(url):
    request = get_request(url)
    return urllib.request.urlopen(request).read()

def get_page(url):
    pagebytes = get_file_bytes(url)
    return pagebytes.decode('utf-8')

def find_link_by_href(pagestring, pattern):     
    
    class LinkByHrefFinder(HTMLParser):
        
        def __init__(self, patter):
            self.pattern = pattern
            self.result = None
            HTMLParser.__init__(self)

        def handle_starttag(self, tag, attrs):
            if not self.result:
                href_attrs = [value for (name, value) in attrs 
                                    if name == 'href']
                href_attr = href_attrs[0] if href_attrs else None
                if href_attr and re.search(pattern, href_attr):
                    self.result = href_attr          
    
    linkfinder = LinkByHrefFinder(pattern)
    linkfinder.feed(pagestring)
    return linkfinder.result    

def get_file_url(code):
    pagestring = get_page(URL_TEMPLATE.format(code))
    return 'http:' + find_link_by_href(pagestring, '.*\\.svg$')

def get_file(code):
    url = get_file_url(code)
    bytes_ = get_file_bytes(url)

    filename = url.split('/')[-1]
    with open(filename, 'wb') as file_:
        file_.write(bytes_)

for color in COLORS:
    for piece in PIECES:
        get_file(piece + color)
