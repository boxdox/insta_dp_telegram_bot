FROM python:3.7-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt && rm -rf /root/.cache

COPY bot.py .
CMD ["python", "-u", "/app/bot.py"]