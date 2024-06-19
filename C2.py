import socket
import os
import requests
import random
import getpass
import time
import sys
import colorama

###color
def color(data_input_output):
    color_codes = {
        "GREEN": '\033[32m',
        "LIGHTGREEN_EX": '\033[92m',
        "YELLOW": '\033[33m',
        "LIGHTYELLOW_EX": '\033[93m',
        "CYAN": '\033[36m',
        "LIGHTCYAN_EX": '\033[96m',
        "BLUE": '\033[34m',
        "LIGHTBLUE_EX": '\033[94m',
        "MAGENTA": '\033[35m',
        "LIGHTMAGENTA_EX": '\033[95m',
        "RED": '\033[31m',
        "LIGHTRED_EX": '\033[91m',
        "BLSYN": '\033[30m',
        "LIGHTBLSYN_EX": '\033[90m',
        "WHITE": '\033[37m',
        "LIGHTWHITE_EX": '\033[97m',
    }

    return color_codes.get(data_input_output, "")

lightwhite = color("LIGHTWHITE_EX")
gray = color("LIGHTBLSYN_EX")
red = color("LIGHTMAGENTA_EX")
###include##
def clear():
    os.system('cls' if os.name == 'nt' else 'clear')
    
proxys = open('loader/proxy.txt').readlines()
bots = len(proxys)

def home():
    clear()
    si()
    print(f'''
    {red}██╗   ██╗       ██████╗██████╗ 
    {red}██║   ██║      ██╔════╝╚════██╗
    {red}██║   ██║█████╗██║      █████╔╝
    {red}╚██╗ ██╔╝╚════╝██║     ██╔═══╝ 
     {red}╚████╔╝       ╚██████╗███████╗
      {red}╚═══╝         ╚═════╝╚══════╝
      {lightwhite}‎ ╔═════════════════════════╗
      {lightwhite}║ ‎ WELCOME BACK TO V-C2 TOOLS‎‎‎‎ ‎ ‎ ║
      {lightwhite}║‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ CC : V-C2 Team‎ ‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ║
      {lightwhite}‎║ ‎ ‎ ‎ ‎ ‎TYPE !HELP For help ‎ ‎ ‎ ‎ ‎ ‎ ‎‎║ ‎ ‎ 
      {lightwhite}‎║‎ ‎ ‎ ‎ ‎ ONLINE BOT : {bots}‎ ‎ ‎ ‎ ‎ ‎‎ ‎ ║ ‎ ‎‎
      {lightwhite} ╚═════════════════════════╝
''')

def help():
    clear()
    si()
    print(f'''
\x1b[38;2;0;212;14m‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎  ‎‎HELP TOOLS
\x1b[38;2;0;212;14m╔═════════════════════════════════╗
\x1b[38;2;0;212;14m║‎ Attacking RU/PS domains is prohibited‎ ║ ‎ ‎ ‎ 
\x1b[38;2;0;212;14m║  This tool is only for paying parties ║   
\x1b[38;2;0;212;14m║‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ Use VPS for great power        ║
\x1b[38;2;0;212;14m╚═════════════════════════════════╝
''')

def list():
    si()
    print(f'''
    {lightwhite}LAYER7 ‎ ‎ ‎ = HTTP/HTTPS FLOODER
    {lightwhite}LAYER4  ‎ ‎ = TCP/UDP/SYN FLODDER
    {lightwhite}EXPLUSIVE = MIRAI/BOTNET
    ''')

def L7():
    clear()
    si()
    print(f'''
    \x1b[38;2;0;212;14m██╗      █████╗ ██╗   ██╗███████╗██████╗ ███████╗
    \x1b[38;2;0;212;14m██║     ██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗╚════██║
    \x1b[38;2;0;212;14m██║     ███████║ ╚████╔╝ █████╗  ██████╔╝    ██╔╝
    \x1b[38;2;0;212;14m██║     ██╔══██║  ╚██╔╝  ██╔══╝  ██╔══██╗   ██╔╝ 
    \x1b[38;2;0;212;14m███████╗██║  ██║   ██║   ███████╗██║  ██║   ██║  
    \x1b[38;2;0;212;14m╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝                                                   
    \x1b[38;2;0;212;14m╔═══════════════════════════════════════════════╗
    \x1b[38;2;0;212;14m║‎ ‎‎‎ HTTP-ZEUZ‎   ‎║‎ HTTP-BROWSER ║ ‎ ‎ HTTP-TLS ‎ ‎‎ ║ HTTP-RAND║
    \x1b[38;2;0;212;14m║ HTTP-ENGINE ‎ ║ ‎ HTTP-STROM ‎ ║‎  HTTP-SOCKET‎ ║‎ HTTP-HCAP║
    \x1b[38;2;0;212;14m╚═══════════════════════════════════════════════╝
''')


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
