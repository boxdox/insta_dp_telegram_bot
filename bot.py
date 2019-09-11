#!/usr/bin/env python
# -*- coding: utf-8 -*-
from telegram.ext import Updater, CommandHandler
from dotenv import load_dotenv, find_dotenv
from os import getenv
import requests

load_dotenv(find_dotenv())

def start(update, context):
	update.message.reply_text("I will send you HighDefinition DP from Instagram! Usage: /get username")

def get_profile(update, context):
	no_account="Sorry, this page isn&#39;t available"
	username=update.message.text.split()[1]
	url = "https://www.instagram.com/"+username

	source  = requests.get(url).text
	if source.find(no_account)==-1:
		l = source.find("pic_url_hd")+13
		r = source.find("requested_by_viewer")-3

		img_url = source[l:r]
		update.message.reply_photo(photo=img_url)
	else:
		update.message.reply_text("This account could not be found, try again.")

def main():
	updater = Updater(getenv('token'), use_context=True)
	dp=updater.dispatcher
	dp.add_handler(CommandHandler('start', start))
	dp.add_handler(CommandHandler('get', get_profile))
	updater.start_polling()
	updater.idle()

if __name__ == '__main__':
	main()