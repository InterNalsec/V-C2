import socket
import os
import requests
import random
import getpass
import time
import sys

def clear():
    os.system('cls' if os.name == 'nt' else 'clear')
    
proxys = open('proxy.txt').readlines()
bots = len(proxys)

def login():
    clear()
    user = "root"
    passwd = "root"
    username = input("</> Username: ")
    password = getpass.getpass(prompt='</> Password: ')
    if username != user or password != passwd:
        print("")
        print("</> Invalid credentials! Abandoning...")
        sys.exit(1)
    elif username == user and password == passwd:
        print("</> Welcome to Vedereta CnC!")
        time.sleep(0.3)
        ascii_vro()
        main()

login()

#################################################(panel)#############################################

def title():
    stdout.write("                                                                                          \n")
    stdout.write("                             "+Fore.LIGHTCYAN_EX   +" ▂▃▅▇█▓▒░ VN-C2 ░▒▓█▇▅▃▂                \n")
    stdout.write("             "+Fore.LIGHTCYAN_EX            +"        ══╦═════════════════════════════════╦══\n")
    stdout.write("             "+Fore.LIGHTCYAN_EX+"╔═════════╩═════════════════════════════════╩═════════╗\n")
    stdout.write("             "+Fore.LIGHTCYAN_EX+"║ "+Fore.LIGHTWHITE_EX   +"        Welcome To The Main Screen Of VN-C2  "+Fore.LIGHTCYAN_EX  +"       ║\n")
    stdout.write("             "+Fore.LIGHTCYAN_EX+"║ "+Fore.LIGHTWHITE_EX   +"          Type [help] to see the Commands    "+Fore.LIGHTCYAN_EX +"       ║\n")
    stdout.write("             "+Fore.LIGHTCYAN_EX+"║ "+Fore.LIGHTWHITE_EX   +"         Contact Dev - Telegram @zjfoq394   "+Fore.LIGHTCYAN_EX +"        ║\n")
    stdout.write("             "+Fore.LIGHTCYAN_EX+"╚═════════════════════════════════════════════════════╝\n")
    stdout.write("\n")

