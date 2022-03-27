import json
import re
import sys
import bs4
import threading
from bs4 import BeautifulSoup as soup
import time
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

################################################################################
# Video_Cards class are identified by its title which could be the name of the
# car or the sale's title. It could also have its ranking in a top list, its
# brand, its price, and its link to buy it. 
################################################################################

class Video_Card:
  def __init__(self, title, rank = None, brand = None,
               price = None, link = None):

    self.brand = brand
    self.title = title
    self.price = price
    self.rank = None if rank is None else int(rank)
    self.link = link

  # Compares two cards based on their rank and based on their price if they 
  # have the same ranking.
  def compareCards(self, video_cards):

    best_card = None

    for card in video_cards:
      if card is None: continue

      if (best_card is None or card.rank < best_card.rank):
        best_card = card
      
      elif (best_card is not None and card.rank == best_card.rank):
        parsed_curr_price = int(card.price.replace(",", ""))
        parsed_best_price = int(best_card.price.replace(",", ""))

        if (parsed_curr_price < parsed_best_price): best_card = card

    return best_card


################################################################################
# The Ranks class runs in its own thread and extracts the ranks of the best 199
# cards from a website.
################################################################################

class Ranks(threading.Thread):
  def __init__(self, thread_name, thread_ID, table):

      threading.Thread.__init__(self)
      self.thread_name = thread_name
      self.thread_ID = thread_ID
      self.table = table

  # Create and process ranking table
  def run(self):

      rank_url = "https://benchmarks.ul.com/compare/best-gpus"
      #rank_client = requests.get(rank_url)
      req = urllib3.PoolManager()
      rank_client = req.request('GET', rank_url)
      rank_soup = soup(rank_client.data, "html.parser")
      rank_client.close()

      rank_table = []
      element_table = rank_soup.findAll("td", {"class":"order-cell"})
      for element in element_table: rank_table.append(element.parent)

      for cell in rank_table:
        name = cell.find("a", {"class":"OneLinkNoTx"}).text
        name = re.sub(r"\w+?\s", "", name, count = 1)
        if (name == "Radeon 6900 XT"): name = "Radeon RX 6900 XT" # Correct name (misspelled in website)
        if (re.search("(Radeon|GeForce) \D", name, flags = re.IGNORECASE)):
          name = re.sub("(Radeon|GeForce) ", "", name, count = 1, flags = re.IGNORECASE)
        name = re.compile(name.replace(" ", "\s?"), flags = re.IGNORECASE)

        rank = cell.td.text
        video_card = Video_Card(name, rank = int(rank))
        self.table.append(video_card)

################################################################################
# The Graphics_Card_Finder class scraps all of the graphics cards from a 
# Newegg page. It requires a url to a Newegg page and a list to place the 
# cards found. It could also get a minimun and maximun price to filter the
# graphics cards with an undesired price.
################################################################################

class Graphics_Card_Finder(threading.Thread):
  def __init__(self, thread_name, thread_ID, lock, url, best_cards_list,
               min_price = None, max_price = None, rank_table = []):

      threading.Thread.__init__(self)
      self.thread_name = thread_name
      self.thread_ID = thread_ID
      self.lock = lock
      self.url = url
      self.min_price = min_price
      self.max_price = max_price
      self.exit_status = None
      self.best_cards_list = best_cards_list
      self.rank_table = rank_table

  # Create and process ranking table
  def run(self):

    try: 
      time.sleep(1)
      #url_client = requests.get(self.url)
      req = urllib3.PoolManager()
      url_client = req.request('GET', self.url)
      page_soup = soup(url_client.data, "html.parser")
      url_client.close()
    except Exception: 
      self.exit_status = sys.exc_info()
      sys.exit(1)

    # Scrap and parse graphic card items in the page and store their info
    best_cards = self.parseItems(page_soup)
    
    self.lock.acquire()
    self.best_cards_list.mergeCardDict(best_cards.card_dict)
    self.lock.release()

  # Scraps the given page, filters unwanted items, and places the remaining
  # cards in the best_cards dictionary where key is the rank of the card.
  def parseItems(self, page_soup):

    best_cards = Card_Dict()
    containers = page_soup.findAll("div", {"class":"item-container"})
    i=1
   
    for container in containers:

      # Parse Price
      try: 
        price = container.find("li", {"class":"price-current"}).strong.text
      except AttributeError:
        try: price = container.find("strong", {"class":"item-buying-choices-price"}).text
        except AttributeError: continue

      parsed_price = int(float(price.replace(",", "").replace("$", "")))

      # Filter based on min and max price
      if (self.max_price is not None and parsed_price > self.max_price):
        continue
        
      if (self.min_price is not None and parsed_price < self.min_price):
        continue

      # Parse Rest of the Information
      try:
        brand = container.find("a", {"class":"item-brand"}).img["title"]
      except AttributeError:
        brand = None

      title = container.find("a", {"class":"item-title"}).text

      rank = self.findCardRank(title)
      if (rank is None): continue

      spec_url = container.find("a", {"class":"item-img"})["href"]

      curr_card = Video_Card(title, rank = rank, brand = brand,
                                  price = price, link = spec_url)
      
      # Update best card list
      best_cards.updateCards(curr_card)

      i+=1

    return best_cards

  # Finds the rank of the graphics card with a given title, and the title can 
  # be the sales title or name of the card.
  def findCardRank(self, title):
    for card in self.rank_table:
      if (card.title.search(title)):
        return card.rank

    return None

################################################################################
# The Card_Dict class is a top list of graphics cards which uses a dictionary 
# data structure to implement the list. It saves the a card along with its rank. 
# If two cards have the same rank, it only saves the one with the lowest price.
################################################################################

class Card_Dict():
  def __init__(self):
    self.card_dict = {}

  def updateCards(self, card):

    if  (card.rank in self.card_dict):
      best_card = card.compareCards([card, self.card_dict[card.rank]])
      self.card_dict.update({card.rank: best_card})
    else:
      self.card_dict.update({card.rank: card})

  def mergeCardDict(self, new_card_dict):

    for rank in new_card_dict:
      self.updateCards(new_card_dict[rank])
      
  def getSortedDict(self):
    return dict(sorted(self.card_dict.items()))

# Main
def handler(event, context):
  # Program Starts Here
    rank_table = []
    rank_thread = Ranks("Downloading Ranks", 1, rank_table)

    rank_thread.start()

    # Prompt for a minimun and maximun price to the user
    max_price = None
    min_price = 50

    rank_thread.join()

    # Initialize Search
    best_card_list = Card_Dict()
    page = 1
    thread_list = []
    lock = threading.Lock()

    # Print title of the page in Newegg and saves the total number of pages
    url = 'https://www.newegg.com/p/pl?tid=7709&N=100007709%204814%204809%204131&PageSize=60&page=1'
    req = urllib3.PoolManager()
    url_client = req.request('GET', url)
    page_soup = soup(url_client.data, "html.parser")

    if (url_client.status != 200): 
        print("Error " + str(url_client.status) + ": Server Rejected Request")
        sys.exit("Error")

    print("\nSite: " + page_soup.title.text)
    total_pages = page_soup.find("span", {"class":"list-tool-pagination-text"}).strong.text
    total_pages = int(re.search(r"\d+/(\d+)", total_pages).group(1))

    url_client.close()
    page_soup.decompose()

    # Find the best graphics cards and place them in a top list
    print("Searching...")

    while (True):
        url = 'https://www.newegg.com/p/pl?tid=7709&N=100007709%204814%204809%204131&PageSize=60&page=' + str(page)

        find_card_thread = Graphics_Card_Finder("Finding Best Card", page, lock, url,
                                                best_card_list, min_price, max_price, rank_table)
        
        find_card_thread.start()
        thread_list.append(find_card_thread)
        
        if (page >= total_pages): break 

        page+=1

    for i in range(len(thread_list)): 
        thread_list[i].join()
        if (thread_list[i].exit_status is not None): print(thread_list[i].exit_status)
    
    best_cards = best_card_list.getSortedDict()

    print("\n" + str(len(best_cards)) + " different cards found in " + str(total_pages) + " pages\n")

    cards_list = []
    for key in best_cards.keys():
        cards_list.append({
         "title" : best_cards[key].title,
         "rank" : best_cards[key].rank,
         "link" : best_cards[key].link,
         "price" : best_cards[key].price,
        })

    return cards_list
  