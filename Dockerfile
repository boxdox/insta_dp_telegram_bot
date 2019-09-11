FROM python:3.7-slim

ADD . /opt/app
WORKDIR /opt/app

COPY requirements.txt .
RUN pip install -r requirements.txt && rm -rf /root/.cache

CMD ["python", "-u", "/app/bot.py"]