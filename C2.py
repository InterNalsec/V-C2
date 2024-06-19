import socket
import os
import requests
import random
import getpass
import time
import sys
###include##
def clear():
    os.system('cls' if os.name == 'nt' else 'clear')
    
proxys = open('proxy.txt').readlines()
bots = len(proxys)

def home():
    clear()
    si()
    print(f```
\x1b[38;2;0;212;14m██╗   ██╗       ██████╗██████╗ 
\x1b[38;2;0;212;14m██║   ██║      ██╔════╝╚════██╗
\x1b[38;2;0;212;14m██║   ██║█████╗██║      █████╔╝
\x1b[38;2;0;212;14m╚██╗ ██╔╝╚════╝██║     ██╔═══╝ 
 \x1b[38;2;0;212;14m╚████╔╝       ╚██████╗███████╗
  \x1b[38;2;0;212;14m╚═══╝         ╚═════╝╚══════╝
\x1b[38;2;0;212;14m╔══════════════════════╗   
\x1b[38;2;0;212;14m║WELCOME BACK TO V-C2 TOOLS║
\x1b[38;2;0;212;14m║CC : V-C2 Team‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ║
\x1b[38;2;0;212;14m║TYPE !HELP For help ‎ ‎ ‎ ‎ ‎ ‎ ║
\x1b[38;2;0;212;14m╚══════════════════════╝
```)

def help():
    clear()
    si()
    print(f```
\x1b[38;2;0;212;14m‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎HELP TOOLS
\x1b[38;2;0;212;14m╔════════════════════════════════╗
\x1b[38;2;0;212;14m║Attacking RU/PS domains is prohibited‎ ║ ‎ ‎ ‎ 
\x1b[38;2;0;212;14m║This tool is only for paying parties  ║   
\x1b[38;2;0;212;14m║Use VPS for great power               ║
\x1b[38;2;0;212;14m╚════════════════════════════════╝
```)

def list():
    si()
    print(f```
    \x1b[38;2;0;212;14mLAYER7 ‎ ‎ ‎ = HTTP/HTTPS FLOODER
    \x1b[38;2;0;212;14mLAYER4  ‎ ‎ = TCP/UDP/SYN FLODDER
    \x1b[38;2;0;212;14mUAM   ‎ ‎   = BYPASS 
    \x1b[38;2;0;212;14mEXPLUSIVE = MIRAI/BOTNET
    ```)

def L7():
    clear()
    si()
    print(f```
\x1b[38;2;0;212;14m██╗      █████╗ ██╗   ██╗███████╗██████╗ ███████╗
\x1b[38;2;0;212;14m██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗╚════██║
\x1b[38;2;0;212;14m██║     ███████║ ╚████╔╝ █████╗  ██████╔╝    ██╔╝
\x1b[38;2;0;212;14m██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗   ██╔╝ 
\x1b[38;2;0;212;14m███████╗██║  ██║   ██║   ███████╗██║  ██║   ██║  
\x1b[38;2;0;212;14m╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝                                                   
\x1b[38;2;0;212;14m╔═════════════════════════════════════════╗
\x1b[38;2;0;212;14m║‎ ‎‎HTTP-ZEUZ‎ ‎║‎ HTTP-BROWSER ║ HTTP-TLS ║ HTTP-RAND║
\x1b[38;2;0;212;14m╚═════════════════════════════════════════╝
```)


def login():
    clear()
    user = "root"
    passwd = "root"
    username = input("Username: ")
    password = getpass.getpass(prompt='Password: ')
    if username != user or password != passwd:
        print("")
        print("Invalid credentials! Abandoning...")
        sys.exit(1)
    elif username == user and password == passwd:
        print("Welcome to V-CnC!")
        time.sleep(0.3)
        home()

login()
