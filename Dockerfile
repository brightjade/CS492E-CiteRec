FROM python:3.8-slim-buster
WORKDIR /
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 8080
COPY . .
CMD gunicorn wsgi:app -w 2 -b 0.0.0.0:8080 -t 30 --max-requests 1 --max-requests-jitter 10